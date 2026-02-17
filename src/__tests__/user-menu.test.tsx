import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Мокаем next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Мокаем auth-client
const mockSignOut = vi.fn();
const mockUseSession = vi.fn();
vi.mock("@/lib/auth-client", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
  useSession: () => mockUseSession(),
}));

import { UserMenu } from "../components/shared/user-menu";

beforeEach(() => {
  vi.clearAllMocks();
});

// ===========================================================================
// Состояние загрузки
// ===========================================================================
describe("UserMenu — загрузка", () => {
  it("показывает skeleton при загрузке сессии", () => {
    mockUseSession.mockReturnValue({ data: null, isPending: true });

    const { container } = render(<UserMenu />);

    // Должны быть элементы с animate-pulse (skeleton)
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });
});

// ===========================================================================
// Нет сессии
// ===========================================================================
describe("UserMenu — без сессии", () => {
  it("ничего не рендерит если нет сессии", () => {
    mockUseSession.mockReturnValue({ data: null, isPending: false });

    const { container } = render(<UserMenu />);

    expect(container.innerHTML).toBe("");
  });
});

// ===========================================================================
// С сессией
// ===========================================================================
describe("UserMenu — авторизованный пользователь", () => {
  const sessionData = {
    user: {
      id: "user-1",
      name: "Иван Петров",
      email: "ivan@example.com",
      image: null,
    },
    session: {
      id: "session-1",
      userId: "user-1",
      token: "abc",
      expiresAt: new Date(),
    },
  };

  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: sessionData, isPending: false });
  });

  it("отображает имя пользователя", () => {
    render(<UserMenu />);

    expect(screen.getByText("Иван Петров")).toBeInTheDocument();
  });

  it("отображает email пользователя", () => {
    render(<UserMenu />);

    expect(screen.getByText("ivan@example.com")).toBeInTheDocument();
  });

  it("отображает заглушку аватара если нет image", () => {
    render(<UserMenu />);

    // Нет <img>, но есть иконка-заглушка
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("отображает аватар если есть image", () => {
    const sessionWithImage = {
      ...sessionData,
      user: { ...sessionData.user, image: "https://example.com/avatar.jpg" },
    };
    mockUseSession.mockReturnValue({
      data: sessionWithImage,
      isPending: false,
    });

    render(<UserMenu />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("alt", "Иван Петров");
  });

  it("имеет кнопку 'Выйти'", () => {
    render(<UserMenu />);

    expect(screen.getByTitle("Выйти")).toBeInTheDocument();
  });

  it("вызывает signOut при клике на кнопку выхода", async () => {
    const user = userEvent.setup();
    mockSignOut.mockResolvedValue({});

    render(<UserMenu />);

    const logoutBtn = screen.getByTitle("Выйти");
    await user.click(logoutBtn);

    expect(mockSignOut).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchOptions: expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      })
    );
  });

  it("редиректит на /login после signOut", async () => {
    const user = userEvent.setup();
    // Мокаем signOut так, чтобы он вызвал onSuccess
    mockSignOut.mockImplementation(async (opts: { fetchOptions: { onSuccess: () => void } }) => {
      opts.fetchOptions.onSuccess();
    });

    render(<UserMenu />);

    const logoutBtn = screen.getByTitle("Выйти");
    await user.click(logoutBtn);

    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
