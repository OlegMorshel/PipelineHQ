import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Мокаем next/navigation
const mockGet = vi.fn().mockReturnValue(null);
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Мокаем auth-client
const mockSignInSocial = vi.fn();
const mockSignInOauth2 = vi.fn();
vi.mock("@/lib/auth-client", () => ({
  signIn: {
    social: (...args: unknown[]) => mockSignInSocial(...args),
    oauth2: (...args: unknown[]) => mockSignInOauth2(...args),
  },
  signOut: vi.fn(),
  useSession: () => ({ data: null, isPending: false }),
}));

// Мокаем sonner
const mockToastError = vi.fn();
vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

import LoginPage from "../app/(auth)/login/page";

beforeEach(() => {
  vi.clearAllMocks();
  mockGet.mockReturnValue(null);
});

// ===========================================================================
// Рендеринг страницы логина
// ===========================================================================
describe("Login Page — рендеринг", () => {
  it("отображает заголовок PipelineHQ", () => {
    render(<LoginPage />);

    expect(screen.getByText("PipelineHQ")).toBeInTheDocument();
  });

  it("отображает подзаголовок с ценностным предложением", () => {
    render(<LoginPage />);

    expect(screen.getByText(/Превратите Threads/)).toBeInTheDocument();
    expect(screen.getByText(/в машину продаж/)).toBeInTheDocument();
  });

  it("отображает кнопку 'Войти через Threads'", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("button", { name: /Войти через Threads/i })
    ).toBeInTheDocument();
  });

  it("отображает кнопку 'Войти через Gmail'", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("button", { name: /Войти через Gmail/i })
    ).toBeInTheDocument();
  });

  it("отображает разделитель 'или'", () => {
    render(<LoginPage />);

    expect(screen.getByText("или")).toBeInTheDocument();
  });

  it("отображает ссылки на Terms и Privacy", () => {
    render(<LoginPage />);

    expect(screen.getByText("Условиями использования")).toHaveAttribute(
      "href",
      "/terms"
    );
    expect(screen.getByText("Политикой конфиденциальности")).toHaveAttribute(
      "href",
      "/privacy"
    );
  });
});

// ===========================================================================
// Действия — клик по кнопкам авторизации
// ===========================================================================
describe("Login Page — авторизация", () => {
  it("вызывает signIn.oauth2 при клике 'Войти через Threads'", async () => {
    const user = userEvent.setup();
    mockSignInOauth2.mockResolvedValue({});

    render(<LoginPage />);

    const threadsBtn = screen.getByRole("button", {
      name: /Войти через Threads/i,
    });
    await user.click(threadsBtn);

    expect(mockSignInOauth2).toHaveBeenCalledWith(
      expect.objectContaining({
        providerId: "threads",
        callbackURL: "/",
        newUserCallbackURL: "/onboarding",
        errorCallbackURL: "/login?error=provider",
      })
    );
  });

  it("вызывает signIn.social при клике 'Войти через Gmail'", async () => {
    const user = userEvent.setup();
    mockSignInSocial.mockResolvedValue({});

    render(<LoginPage />);

    const googleBtn = screen.getByRole("button", {
      name: /Войти через Gmail/i,
    });
    await user.click(googleBtn);

    expect(mockSignInSocial).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "google",
        callbackURL: "/",
        newUserCallbackURL: "/onboarding",
        errorCallbackURL: "/login?error=provider",
      })
    );
  });

  it("дизейблит обе кнопки во время загрузки", async () => {
    const user = userEvent.setup();
    // signIn.oauth2 не резолвится → кнопки остаются disabled
    mockSignInOauth2.mockReturnValue(new Promise(() => {}));

    render(<LoginPage />);

    const threadsBtn = screen.getByRole("button", {
      name: /Войти через Threads/i,
    });
    const googleBtn = screen.getByRole("button", {
      name: /Войти через Gmail/i,
    });

    await user.click(threadsBtn);

    // Обе кнопки должны быть disabled
    expect(threadsBtn).toBeDisabled();
    expect(googleBtn).toBeDisabled();
  });

  it("показывает toast при ошибке авторизации", async () => {
    const user = userEvent.setup();
    mockSignInOauth2.mockRejectedValue(new Error("Network error"));

    render(<LoginPage />);

    const threadsBtn = screen.getByRole("button", {
      name: /Войти через Threads/i,
    });
    await user.click(threadsBtn);

    expect(mockToastError).toHaveBeenCalledWith(
      "Не удалось начать авторизацию. Попробуйте снова."
    );
  });
});
