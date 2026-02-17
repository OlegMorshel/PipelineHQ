import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

// Защита от trailing whitespace/newline в env-переменных (Vercel dashboard
// иногда сохраняет \n при копировании из буфера обмена)
const ENV = {
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL?.trim(),
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET?.trim(),
  META_CLIENT_ID: process.env.META_CLIENT_ID?.trim() ?? "",
  META_CLIENT_SECRET: process.env.META_CLIENT_SECRET?.trim() ?? "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID?.trim() ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "",
} as const;

export const auth = betterAuth({
  baseURL: ENV.BETTER_AUTH_URL,
  secret: ENV.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  advanced: {
    database: {
      generateId: "uuid",
    },
  },

  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "threads",
          authorizationUrl: "https://www.threads.net/oauth/authorize",
          tokenUrl: "https://graph.threads.net/oauth/access_token",
          // Threads API требует scope через запятую, а better-auth
          // по умолчанию соединяет пробелом — переопределяем через authorizationUrlParams
          scopes: ["threads_basic", "threads_content_publish", "threads_manage_insights"],
          clientId: ENV.META_CLIENT_ID,
          clientSecret: ENV.META_CLIENT_SECRET,
          redirectURI: `${ENV.BETTER_AUTH_URL}/api/auth/oauth2/callback/threads`,
          authorizationUrlParams: {
            scope: "threads_basic,threads_content_publish,threads_manage_insights",
          },

          // Кастомный обмен кода на токен:
          // 1. Получаем short-lived токен
          // 2. Обмениваем на long-lived токен (60 дней)
          async getToken({ code, redirectURI }) {
            const params = new URLSearchParams({
              client_id: ENV.META_CLIENT_ID,
              client_secret: ENV.META_CLIENT_SECRET,
              grant_type: "authorization_code",
              redirect_uri: redirectURI,
              code,
            });

            const res = await fetch("https://graph.threads.net/oauth/access_token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: params.toString(),
            });

            if (!res.ok) {
              throw new Error(`Threads token exchange failed: ${res.status}`);
            }

            const data = await res.json();
            // data = { access_token, token_type, user_id }

            // Обмениваем на long-lived token
            let accessToken = data.access_token;
            let expiresIn: number | undefined;

            try {
              const llRes = await fetch(
                `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${ENV.META_CLIENT_SECRET}&access_token=${data.access_token}`
              );
              if (llRes.ok) {
                const llData = await llRes.json();
                accessToken = llData.access_token;
                expiresIn = llData.expires_in; // ~5184000 (60 дней)
              }
            } catch {
              // Fallback на short-lived token (1 час)
            }

            return {
              accessToken,
              tokenType: data.token_type || "bearer",
              accessTokenExpiresAt: expiresIn
                ? new Date(Date.now() + expiresIn * 1000)
                : undefined,
              raw: { ...data, user_id: data.user_id },
            };
          },

          // Получаем профиль из Threads API
          async getUserInfo(tokens) {
            const res = await fetch(
              `https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${tokens.accessToken}`
            );

            if (!res.ok) return null;

            const profile = await res.json();

            return {
              id: profile.id,
              name: profile.name || profile.username || "Threads User",
              // Threads не возвращает email — генерируем placeholder
              email: `${profile.id}@threads.placeholder`,
              emailVerified: false,
              image: profile.threads_profile_picture_url,
            };
          },

          // Маппим дополнительные поля в user record
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mapProfileToUser(profile): any {
            return {
              threadsId: String(profile.id),
              threadsUsername: (profile as Record<string, unknown>).username as string | undefined,
            };
          },
        },
      ],
    }),
  ],

  socialProviders: {
    google: {
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 дней
    updateAge: 60 * 60 * 24, // обновление сессии каждые 24 часа
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // кэш cookie 5 минут
    },
  },

  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
      threadsId: {
        type: "string",
        required: false,
        unique: true,
        fieldName: "threadsId",
      },
      threadsUsername: {
        type: "string",
        required: false,
        fieldName: "threadsUsername",
      },
      onboardingCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
        fieldName: "onboardingCompleted",
      },
      onboardingStep: {
        type: "number",
        required: false,
        defaultValue: 0,
        fieldName: "onboardingStep",
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
});

// Type-safe экспорт для использования на сервере
export type Session = typeof auth.$Infer.Session;
