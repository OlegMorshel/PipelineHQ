import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

// Автоматически определяем baseURL: env-переменная → текущий origin в браузере → fallback
const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const authClient = createAuthClient({
  baseURL,
  plugins: [genericOAuthClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
