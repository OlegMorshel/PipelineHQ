import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    // Meta OAuth (Threads авторизация через Meta)
    // Настроить после получения доступа через Meta for Developers
    // facebook: {
    //   clientId: process.env.META_CLIENT_ID!,
    //   clientSecret: process.env.META_CLIENT_SECRET!,
    //   scope: ["threads_basic", "threads_content_publish"],
    // },
  },
});
