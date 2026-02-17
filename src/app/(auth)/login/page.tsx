"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AtSign, Mail, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

const ERROR_MESSAGES: Record<string, string> = {
  cancelled: "Авторизация отменена. Попробуйте снова.",
  provider: "Ошибка сервиса авторизации. Попробуйте позже.",
  account_exists: "Этот аккаунт уже привязан к другой учётной записи.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // Показ ошибки из query params
  const error = searchParams.get("error");
  if (error && ERROR_MESSAGES[error]) {
    if (typeof window !== "undefined") {
      const shown = sessionStorage.getItem(`auth_error_${error}`);
      if (!shown) {
        sessionStorage.setItem(`auth_error_${error}`, "1");
        setTimeout(() => {
          toast.error(ERROR_MESSAGES[error]);
          const url = new URL(window.location.href);
          url.searchParams.delete("error");
          window.history.replaceState({}, "", url.toString());
        }, 100);
      }
    }
  }

  const handleSignIn = async (provider: "google" | "threads") => {
    setLoadingProvider(provider);
    try {
      if (provider === "google") {
        await signIn.social({
          provider: "google",
          callbackURL: "/",
          newUserCallbackURL: "/onboarding",
          errorCallbackURL: "/login?error=provider",
        });
      }
      if (provider === "threads") {
        await signIn.oauth2({
          providerId: "threads",
          callbackURL: "/",
          newUserCallbackURL: "/onboarding",
          errorCallbackURL: "/login?error=provider",
        });
      }
    } catch {
      toast.error("Не удалось начать авторизацию. Попробуйте снова.");
      setLoadingProvider(null);
    }
  };

  const isLoading = loadingProvider !== null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div
        className="mx-auto flex w-full max-w-[360px] flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400"
      >
        {/* Logo */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">PipelineHQ</h1>
          <p className="text-sm text-muted-foreground">
            Превратите Threads
            <br />в машину продаж
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="flex w-full flex-col gap-3">
          {/* Threads — primary */}
          <Button
            className="w-full h-12 rounded-xl text-[15px] font-semibold gap-2 active:scale-[0.98] transition-transform"
            disabled={isLoading}
            onClick={() => handleSignIn("threads")}
          >
            {loadingProvider === "threads" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <AtSign className="h-4 w-4" />
            )}
            Войти через Threads
          </Button>

          {/* Разделитель */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">или</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google — secondary */}
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl text-[15px] font-medium gap-2 active:scale-[0.98] transition-transform"
            disabled={isLoading}
            onClick={() => handleSignIn("google")}
          >
            {loadingProvider === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Войти через Gmail
          </Button>
        </div>

        {/* Terms */}
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          Регистрируясь, вы соглашаетесь с{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
            Условиями использования
          </a>{" "}
          и{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Политикой конфиденциальности
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
