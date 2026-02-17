# TASK-000: Задачи — Регистрация и Авторизация

## Связанные User Stories
- US-000.1 — US-000.7

---

## Backend задачи

### TASK-000-B1: Настройка Better Auth с OAuth-провайдерами ✅

- [x] Установка и конфигурация Better Auth
- [x] Настройка Meta OAuth (Threads):
  - App в Meta for Developers
  - Scopes: `threads_basic`, `threads_content_publish`, `threads_manage_insights`
  - Callback URL: `/api/auth/oauth2/callback/threads`
- [x] Настройка Google OAuth (Gmail):
  - App в Google Cloud Console
  - Scopes: `email`, `profile`
  - Callback URL: `/api/auth/callback/google`
- [x] Конфигурация Better Auth:
  - Database adapter (Drizzle + PostgreSQL)
  - Session strategy: database sessions (30 дней)
  - Account linking: включить для связывания Threads + Gmail
- **Приоритет:** 🔴 Critical
- **Оценка:** 6h
- **User Story:** US-000.1, US-000.2
- **Реализация:** `src/lib/auth.ts`, `src/lib/auth-client.ts`

---

### TASK-000-B2: Схема БД — Auth-таблицы ✅

- [x] Таблицы Better Auth (автоматические):
  - `users` — id, name, email, image, emailVerified, bio, threadsId, threadsUsername, onboardingCompleted, onboardingStep, createdAt, updatedAt
  - `sessions` — id, userId, token, expiresAt, ipAddress, userAgent
  - `accounts` — id, userId, accountId, providerId, accessToken, refreshToken, expiresAt, scope, idToken
  - `verifications` — id, identifier, value, expiresAt
- [x] Дополнительные поля в `users`:
  - `onboarding_completed: boolean`
  - `onboarding_step: integer`
  - `threads_id: text` (unique)
  - `threads_username: text`
  - `bio: text`
- [x] Индексы:
  - `users.email` — unique
  - `users.threads_id` — unique
  - `sessions.token` — unique
- [x] Миграция через Drizzle Kit
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-000.1, US-000.2, US-000.6
- **Реализация:** `src/lib/db/schema.ts`

---

### TASK-000-B3: OAuth Callback — обработка и маршрутизация ✅

- [x] `/api/auth/[...all]/route.ts` — единый обработчик через `toNextJsHandler(auth)`:
  - Threads: кастомный `getToken` (short-lived → long-lived token exchange)
  - Threads: кастомный `getUserInfo` из Threads API (id, username, name, picture, bio)
  - Threads: `mapProfileToUser` — маппинг threadsId и threadsUsername
  - Google: встроенный socialProvider от Better Auth
- [x] Маршрутизация через клиент:
  - `callbackURL: "/"` — существующий пользователь → Dashboard
  - `newUserCallbackURL: "/onboarding"` — новый пользователь → Onboarding
  - `errorCallbackURL: "/login?error=provider"` — ошибка → Login
- [x] Обработка ошибок:
  - Пользователь отменил OAuth → redirect `/login?error=cancelled`
  - OAuth provider error → redirect `/login?error=provider`
  - Аккаунт уже привязан к другому юзеру → redirect `/login?error=account_exists`
- **Приоритет:** 🔴 Critical
- **Оценка:** 5h
- **User Story:** US-000.1, US-000.2, US-000.4
- **Реализация:** `src/app/api/auth/[...all]/route.ts`, `src/lib/auth.ts` (genericOAuth config)

---

### TASK-000-B4: Account Linking — привязка Threads к Gmail-аккаунту

- Endpoint: `POST /api/auth/link/threads`
  - Требует активную сессию (пользователь уже залогинен через Gmail)
  - Запускает Meta OAuth flow
  - Callback → привязывает Threads-аккаунт к существующему user
  - Сохраняет access_token и refresh_token
- Проверки:
  - Threads-аккаунт не привязан к другому пользователю
  - Пользователь ещё не имеет привязанного Threads-аккаунта
- **Приоритет:** 🟡 High
- **Оценка:** 4h
- **User Story:** US-000.3

---

### TASK-000-B5: Middleware — защита роутов ✅

- [x] Next.js middleware (`middleware.ts`):
  - Публичные роуты: `/login`, `/api/auth/*`
  - Защищённые роуты: всё остальное → проверка сессии через `betterFetch`
  - Если нет сессии → redirect `/login`
- [x] Маршрутизация авторизованных:
  - Если onboarding не пройден → redirect `/onboarding`
  - Если пользователь на `/login` и уже авторизован → redirect `/`
  - Если onboarding пройден, а пользователь на `/onboarding` → redirect `/`
- [x] Передача cookies из запроса в betterFetch для верификации сессии
- [x] Matcher: исключены `_next/static`, `_next/image`, `favicon.ico`, `sitemap.xml`, `robots.txt`
- [x] **Покрыто 17 тестами** (`src/__tests__/middleware.test.ts`)
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-000.6
- **Реализация:** `src/middleware.ts`

---

### TASK-000-B6: Token Refresh — автообновление Threads-токенов

- Сервис `ThreadsTokenRefresher`:
  - Проверка срока жизни access_token перед каждым запросом к Threads API
  - Если истёк → обновление через refresh_token
  - Если refresh_token невалиден → пометка аккаунта как "requires_reauth"
- Cron job (опционально): проактивное обновление токенов, истекающих в ближайшие 24h
- **Приоритет:** 🟡 High
- **Оценка:** 3h
- **User Story:** US-000.7

---

### TASK-000-B7: Безопасность

- Шифрование access_token и refresh_token в БД (AES-256 или through Better Auth encryption)
- CSRF-защита на auth endpoints (Better Auth встроенная)
- Rate limiting через Upstash Redis:
  - `/api/auth/*` — 10 запросов в минуту на IP
  - OAuth callback — 5 запросов в минуту на IP
- HTTP-only cookies для сессий
- Secure + SameSite flags на cookies
- **Приоритет:** 🟡 High
- **Оценка:** 3h
- **User Story:** US-000.7

---

## Frontend задачи

### TASK-000-F1: UI — Экран входа (Login Page) ✅

- [x] Страница `/login`:
  - Лого PipelineHQ (по центру)
  - Заголовок с ценностным предложением: «Превратите Threads в машину продаж»
  - Кнопка "Войти через Threads" — primary, иконка AtSign (Lucide)
  - Кнопка "Войти через Gmail" — outline, иконка Mail (Lucide)
  - Разделитель «или» между кнопками
  - Текст и ссылки на Условия использования и Политику конфиденциальности
- [x] Состояния:
  - Default — кнопки активны
  - Loading — после клика: обе кнопки disabled + спиннер на нажатой
  - Error — toast через Sonner (из query params: `?error=cancelled|provider|account_exists`)
- [x] Mobile-first, responsive (max-w-[360px])
- [x] Анимация появления (animate-in fade-in slide-in-from-bottom-4)
- [x] **Покрыто 10 тестами** (`src/__tests__/login-page.test.tsx`)
- **Приоритет:** 🔴 Critical
- **Оценка:** 4h
- **User Story:** US-000.5
- **Реализация:** `src/app/(auth)/login/page.tsx`

---

### TASK-000-F2: Обработка ошибок OAuth на клиенте ✅

- [x] Парсинг query params на `/login`:
  - `?error=cancelled` → "Авторизация отменена. Попробуйте снова."
  - `?error=provider` → "Ошибка сервиса авторизации. Попробуйте позже."
  - `?error=account_exists` → "Этот аккаунт уже привязан к другой учётной записи."
- [x] Toast-уведомления через Sonner
- [x] Автоматическое удаление error из URL после показа (`window.history.replaceState`)
- [x] Защита от дублирования toast через sessionStorage
- **Приоритет:** 🟡 High
- **Оценка:** 2h
- **User Story:** US-000.1, US-000.2
- **Реализация:** `src/app/(auth)/login/page.tsx` (LoginContent компонент)

---

### TASK-000-F3: Кнопка "Выйти" и управление сессией ✅

- [x] Компонент `UserMenu` в sidebar:
  - Аватар (image или заглушка с иконкой User)
  - Имя и email пользователя
  - Кнопка "Выйти" (иконка LogOut)
  - Skeleton-состояние при загрузке сессии
  - Возвращает null если нет сессии
- [x] Кнопка "Выйти":
  - Вызов `signOut` через Better Auth client
  - `onSuccess` → `router.push("/login")`
- [x] **Покрыто 9 тестами** (`src/__tests__/user-menu.test.tsx`)
- **Приоритет:** 🟢 Medium
- **Оценка:** 2h
- **User Story:** US-000.6
- **Реализация:** `src/components/shared/user-menu.tsx`

---

### TASK-000-F4: Кнопка "Подключить Threads" (Account Linking UI)

- Компонент для привязки Threads (используется в онбординге и настройках):
  - Кнопка "Подключить Threads" с иконкой
  - Состояние: подключён / не подключён
  - Если подключён: показать username + кнопка "Отключить"
  - Если не подключён: кнопка "Подключить" → OAuth flow
- Обработка ошибок привязки
- **Приоритет:** 🟡 High
- **Оценка:** 3h
- **User Story:** US-000.3

---

### TASK-000-T1: Тесты авторизации ✅

- [x] Настройка тестового окружения:
  - Vitest + jsdom + @testing-library/react
  - Конфиг `vitest.config.ts` с алиасом `@/`
  - Setup файл с jest-dom матчерами
- [x] Тесты middleware (17 тестов):
  - Публичные роуты (/login, /api/auth/*) пропускаются
  - Неавторизованные → redirect /login
  - Онбординг не пройден → redirect /onboarding
  - Онбординг пройден → пропуск / redirect с /onboarding
  - Передача cookies в betterFetch
- [x] Тесты Login Page (10 тестов):
  - Рендер UI (заголовок, кнопки, ссылки)
  - signIn.oauth2 для Threads, signIn.social для Google
  - Disabled-состояние во время загрузки
  - Toast при ошибке авторизации
- [x] Тесты UserMenu (9 тестов):
  - Skeleton при загрузке, null без сессии
  - Отображение имени, email, аватара
  - signOut + redirect на /login
- [x] Git hooks (Husky + lint-staged):
  - Pre-commit: lint-staged (ESLint) + npm test
  - Скрипты: test, test:watch, test:coverage
- **Приоритет:** 🟡 High
- **Оценка:** 3h
- **User Story:** US-000.5, US-000.6
- **Реализация:** `src/__tests__/middleware.test.ts`, `src/__tests__/login-page.test.tsx`, `src/__tests__/user-menu.test.tsx`, `vitest.config.ts`, `.husky/pre-commit`

---

## Суммарная оценка модуля

| Тип | Задачи | Статус | Часы |
|-----|--------|--------|------|
| Backend | B1 Настройка Better Auth | ✅ | 6h |
| Backend | B2 Схема БД | ✅ | 3h |
| Backend | B3 OAuth Callback | ✅ | 5h |
| Backend | B4 Account Linking | ⬜ | 4h |
| Backend | B5 Middleware | ✅ | 3h |
| Backend | B6 Token Refresh | ⬜ | 3h |
| Backend | B7 Безопасность | ⬜ | 3h |
| Frontend | F1 Login Page | ✅ | 4h |
| Frontend | F2 Обработка ошибок | ✅ | 2h |
| Frontend | F3 UserMenu + Выйти | ✅ | 2h |
| Frontend | F4 Подключить Threads UI | ⬜ | 3h |
| Тесты | T1 Тесты авторизации | ✅ | 3h |
| **Итого** | **12 задач (8 ✅ / 4 ⬜)** | | **~41h** |
