# TASK-000: Задачи — Регистрация и Авторизация

## Связанные User Stories
- US-000.1 — US-000.7

---

## Backend задачи

### TASK-000-B1: Настройка Better Auth с OAuth-провайдерами

- Установка и конфигурация Better Auth
- Настройка Meta OAuth (Threads):
  - App в Meta for Developers
  - Scopes: `threads_basic`, `threads_content_publish`, `threads_manage_insights`
  - Callback URL: `/api/auth/callback/threads`
- Настройка Google OAuth (Gmail):
  - App в Google Cloud Console
  - Scopes: `email`, `profile`
  - Callback URL: `/api/auth/callback/google`
- Конфигурация Better Auth:
  - Database adapter (Drizzle + PostgreSQL)
  - Session strategy: database sessions (30 дней)
  - Account linking: включить для связывания Threads + Gmail
- **Приоритет:** 🔴 Critical
- **Оценка:** 6h
- **User Story:** US-000.1, US-000.2

---

### TASK-000-B2: Схема БД — Auth-таблицы

- Таблицы Better Auth (автоматические):
  - `users` — id, name, email, image, emailVerified, createdAt, updatedAt
  - `sessions` — id, userId, token, expiresAt, ipAddress, userAgent
  - `accounts` — id, userId, provider, providerAccountId, accessToken, refreshToken, expiresAt
- Дополнительные поля в `users`:
  - `onboarding_completed: boolean`
  - `onboarding_step: integer`
- Индексы:
  - `accounts.providerAccountId` — unique по provider
  - `sessions.token` — unique
- Миграция через Drizzle Kit
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-000.1, US-000.2, US-000.6

---

### TASK-000-B3: OAuth Callback — обработка и маршрутизация

- `/api/auth/callback/threads`:
  - Получение access_token и refresh_token от Meta
  - Создание/обновление пользователя через Better Auth
  - Сохранение Threads-токенов в таблицу `accounts`
  - Определение: новый пользователь или существующий
  - Redirect: новый → `/onboarding`, существующий → `/dashboard`
- `/api/auth/callback/google`:
  - Получение данных профиля (email, name, image) от Google
  - Создание/обновление пользователя через Better Auth
  - Redirect: новый → `/onboarding`, существующий → `/dashboard`
- Обработка ошибок:
  - Пользователь отменил OAuth → redirect `/login?error=cancelled`
  - OAuth provider error → redirect `/login?error=provider`
  - Аккаунт уже привязан к другому юзеру → redirect `/login?error=account_exists`
- **Приоритет:** 🔴 Critical
- **Оценка:** 5h
- **User Story:** US-000.1, US-000.2, US-000.4

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

### TASK-000-B5: Middleware — защита роутов

- Next.js middleware (`middleware.ts`):
  - Публичные роуты: `/login`, `/api/auth/*`, `/` (landing)
  - Защищённые роуты: всё остальное → проверка сессии через Better Auth
  - Если нет сессии → redirect `/login`
- Маршрутизация авторизованных:
  - Если onboarding не пройден → redirect `/onboarding`
  - Если пользователь на `/login` и уже авторизован → redirect `/dashboard`
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-000.6

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

### TASK-000-F1: UI — Экран входа (Login Page)

- Страница `/login`:
  - Лого PipelineHQ (по центру)
  - Заголовок с ценностным предложением
  - Кнопка "Войти через Threads" — primary, иконка Threads
  - Кнопка "Войти через Gmail" — secondary/outline, иконка Google
  - Разделитель между кнопками
  - Текст: "Регистрируясь, вы соглашаетесь с Условиями использования и Политикой конфиденциальности"
  - Ссылки на ToS и Privacy Policy
- Состояния:
  - Default — кнопки активны
  - Loading — после клика: кнопка disabled + спиннер, вторая кнопка disabled
  - Error — сообщение об ошибке (из query params: `?error=cancelled`)
- Mobile-first, responsive
- Тёмная тема (design system)
- Анимация появления (Framer Motion)
- **Приоритет:** 🔴 Critical
- **Оценка:** 4h
- **User Story:** US-000.5

---

### TASK-000-F2: Обработка ошибок OAuth на клиенте

- Парсинг query params на `/login`:
  - `?error=cancelled` → "Авторизация отменена. Попробуйте снова."
  - `?error=provider` → "Ошибка сервиса авторизации. Попробуйте позже."
  - `?error=account_exists` → "Этот аккаунт уже привязан к другой учётной записи."
- Toast-уведомления через Sonner
- Автоматическое удаление error из URL после показа
- **Приоритет:** 🟡 High
- **Оценка:** 2h
- **User Story:** US-000.1, US-000.2

---

### TASK-000-F3: Кнопка "Выйти" и управление сессией

- Компонент `UserMenu` в sidebar / header:
  - Аватар и имя пользователя
  - Dropdown: "Настройки", "Выйти"
- Кнопка "Выйти":
  - Вызов Better Auth sign out
  - Redirect на `/login`
  - Очистка клиентского состояния
- **Приоритет:** 🟢 Medium
- **Оценка:** 2h
- **User Story:** US-000.6

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

## Суммарная оценка модуля

| Тип | Задачи | Часы |
|-----|--------|------|
| Backend | B1–B7 | ~27h |
| Frontend | F1–F4 | ~11h |
| **Итого** | **11 задач** | **~38h** |
