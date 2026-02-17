import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Мокаем betterFetch
const mockBetterFetch = vi.fn();
vi.mock("@better-fetch/fetch", () => ({
  betterFetch: (...args: unknown[]) => mockBetterFetch(...args),
}));

// Мокаем тип Session
vi.mock("@/lib/auth", () => ({
  // Достаточно экспортировать пустой объект — нам нужен только тип
}));

import { middleware } from "../middleware";

// Хелпер для создания NextRequest
function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), {
    headers: { cookie: "test-session-cookie=abc" },
  });
}

// Фабрика сессий
function mockSession(overrides: Record<string, unknown> = {}) {
  return {
    user: {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      onboardingCompleted: false,
      ...overrides,
    },
    session: {
      id: "session-1",
      userId: "user-1",
      token: "token-abc",
      expiresAt: new Date(Date.now() + 86400000),
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ===========================================================================
// 1. Публичные роуты — пропускаются без проверки сессии
// ===========================================================================
describe("Публичные роуты", () => {
  it("пропускает /login без проверки сессии", async () => {
    const res = await middleware(createRequest("http://localhost:3000/login"));

    expect(res.status).toBe(200);
    // betterFetch НЕ должен вызываться для публичных роутов
    expect(mockBetterFetch).not.toHaveBeenCalled();
  });

  it("пропускает /api/auth/* без проверки сессии", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/api/auth/get-session")
    );

    expect(res.status).toBe(200);
    expect(mockBetterFetch).not.toHaveBeenCalled();
  });

  it("пропускает /api/auth/oauth2/callback/threads", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/api/auth/oauth2/callback/threads")
    );

    expect(res.status).toBe(200);
    expect(mockBetterFetch).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// 2. Неавторизованный пользователь → редирект на /login
// ===========================================================================
describe("Неавторизованный пользователь", () => {
  it("редиректит на /login при отсутствии сессии", async () => {
    mockBetterFetch.mockResolvedValue({ data: null });

    const res = await middleware(createRequest("http://localhost:3000/"));

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });

  it("редиректит на /login при доступе к /plan без сессии", async () => {
    mockBetterFetch.mockResolvedValue({ data: null });

    const res = await middleware(
      createRequest("http://localhost:3000/plan")
    );

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });

  it("редиректит на /login при доступе к /onboarding без сессии", async () => {
    mockBetterFetch.mockResolvedValue({ data: null });

    const res = await middleware(
      createRequest("http://localhost:3000/onboarding")
    );

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });
});

// ===========================================================================
// 3. Авторизованный пользователь — онбординг НЕ пройден
// ===========================================================================
describe("Авторизованный, онбординг не пройден", () => {
  beforeEach(() => {
    mockBetterFetch.mockResolvedValue({
      data: mockSession({ onboardingCompleted: false }),
    });
  });

  it("редиректит с / на /onboarding", async () => {
    const res = await middleware(createRequest("http://localhost:3000/"));

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/onboarding");
  });

  it("редиректит с /plan на /onboarding", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/plan")
    );

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/onboarding");
  });

  it("пропускает на /onboarding (уже там)", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/onboarding")
    );

    expect(res.status).toBe(200);
  });

  it("пропускает на /onboarding/step-2", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/onboarding/step-2")
    );

    expect(res.status).toBe(200);
  });
});

// ===========================================================================
// 4. Авторизованный пользователь — онбординг ПРОЙДЕН
// ===========================================================================
describe("Авторизованный, онбординг пройден", () => {
  beforeEach(() => {
    mockBetterFetch.mockResolvedValue({
      data: mockSession({ onboardingCompleted: true }),
    });
  });

  it("пропускает на / (дашборд)", async () => {
    const res = await middleware(createRequest("http://localhost:3000/"));

    expect(res.status).toBe(200);
  });

  it("пропускает на /plan", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/plan")
    );

    expect(res.status).toBe(200);
  });

  it("пропускает на /analytics", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/analytics")
    );

    expect(res.status).toBe(200);
  });

  it("редиректит с /onboarding на / (онбординг уже пройден)", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/onboarding")
    );

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  });

  it("редиректит с /onboarding/step-2 на /", async () => {
    const res = await middleware(
      createRequest("http://localhost:3000/onboarding/step-2")
    );

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  });
});

// ===========================================================================
// 5. Передача cookies при проверке сессии
// ===========================================================================
describe("Передача cookies", () => {
  it("передаёт cookies из запроса в betterFetch", async () => {
    mockBetterFetch.mockResolvedValue({
      data: mockSession({ onboardingCompleted: true }),
    });

    const req = new NextRequest(new URL("http://localhost:3000/plan"), {
      headers: { cookie: "better-auth.session_token=xyz123" },
    });

    await middleware(req);

    expect(mockBetterFetch).toHaveBeenCalledWith(
      "/api/auth/get-session",
      expect.objectContaining({
        headers: expect.objectContaining({
          cookie: "better-auth.session_token=xyz123",
        }),
      })
    );
  });

  it("передаёт пустую строку если cookie отсутствует", async () => {
    mockBetterFetch.mockResolvedValue({ data: null });

    const req = new NextRequest(new URL("http://localhost:3000/plan"));

    await middleware(req);

    expect(mockBetterFetch).toHaveBeenCalledWith(
      "/api/auth/get-session",
      expect.objectContaining({
        headers: expect.objectContaining({
          cookie: "",
        }),
      })
    );
  });
});
