import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth";

// Публичные роуты, не требующие авторизации
const publicRoutes = ["/login", "/api/auth"];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем публичные роуты
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Проверяем сессию через Better Auth API
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  // Нет сессии → редирект на логин
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Авторизованный пользователь на /login → редирект на дашборд
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Проверка онбординга: если не пройден → редирект на онбординг
  // (кроме самой страницы онбординга)
  const user = session.user as Session["user"] & {
    onboardingCompleted?: boolean;
  };

  if (!user.onboardingCompleted && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Если онбординг пройден, но пользователь на /onboarding → редирект на дашборд
  if (user.onboardingCompleted && pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Проверяем все роуты кроме:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Публичные файлы
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
