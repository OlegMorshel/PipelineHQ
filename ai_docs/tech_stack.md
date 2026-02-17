# PipelineHQ — Технологический стек

## Обзор

PipelineHQ — full-stack веб-приложение на базе Next.js. Архитектура оптимизирована
под MVP: минимум внешних зависимостей, максимум встроенных возможностей Next.js 15
и React 19. Приложение деплоится на Vercel, данные хранятся в PostgreSQL,
AI-функции работают через OpenAI API.

---

## Frontend

### Next.js 15 (App Router)

**Роль:** Основной фреймворк приложения (frontend + backend).

Next.js объединяет серверный рендеринг, API-слой и клиентский интерфейс в одном
проекте. App Router — это архитектура маршрутизации на основе файловой системы
с поддержкой Server Components, Server Actions и streaming.

**Почему выбран:**
- Server Components позволяют фетчить данные прямо на сервере без клиентского
  стейт-менеджера — идеально для Dashboard, Daily Plan, Analytics
- Server Actions заменяют REST API для мутаций — type-safe от формы до БД
- Streaming — для потоковой передачи AI-генерации (typewriter-эффект)
- `next/font` — оптимизированная загрузка шрифта Inter
- Нативная поддержка Vercel для деплоя

---

### React 19

**Роль:** UI-библиотека (под капотом Next.js 15).

React 19 добавляет встроенные примитивы для работы с серверными данными,
что критически важно для PipelineHQ.

**Ключевые возможности, используемые в проекте:**
- `useOptimistic` — мгновенное обновление UI при отметке задач в Daily Plan,
  смене статуса лида, без ожидания ответа сервера
- `useActionState` — отслеживание состояния Server Actions (loading, error, result)
- `useFormStatus` — состояние отправки формы (pending) для кнопок и индикаторов
- `use` — чтение промисов и контекста в рендере

---

### TypeScript

**Роль:** Статическая типизация всего проекта.

Все файлы проекта написаны на TypeScript. Единые типы используются от схемы БД
(Drizzle) через Server Actions до клиентских компонентов.

**Почему выбран:**
- Автокомплит и раннее обнаружение ошибок в IDE
- Type-safe связка: Drizzle schema → Server Action → React компонент
- Zod-схемы используются и для валидации форм, и для AI structured output
- Критически важен при работе с внешними API (Threads, OpenAI)

---

### shadcn/ui

**Роль:** Библиотека UI-компонентов.

shadcn/ui — это не npm-пакет, а набор копируемых компонентов на основе Radix UI
и Tailwind CSS. Компоненты копируются в проект и полностью кастомизируются.

**Почему выбран:**
- Полный контроль над кодом компонентов — можно менять под design system
- Встроенная доступность через Radix UI примитивы
- Тёмная тема через CSS-переменные — уже настроена в design system
- Компоненты используемые в проекте: Button, Card, Input, Badge, Sheet, Dialog,
  RadioGroup, Tabs, Progress, Checkbox, Form, Select, Textarea, Sonner

**Связанные технологии (входят в shadcn/ui):**
- **Radix UI** — headless-примитивы доступности (Dialog, Popover, Select и т.д.)
- **Lucide Icons** — иконки (Home, ListChecks, PenLine, Sparkles и другие)

---

### Tailwind CSS v4

**Роль:** Утилитарный CSS-фреймворк для стилизации.

Все стили в проекте описываются через Tailwind-классы прямо в JSX.
CSS-переменные shadcn/ui интегрированы с Tailwind через `globals.css`.

**Почему выбран:**
- Скорость разработки — стили пишутся прямо в компонентах
- Консистентность — шкала размеров, цветов, отступов из коробки
- v4 — нативные CSS layers, улучшенная производительность
- Идеально работает с shadcn/ui

---

### Framer Motion

**Роль:** Библиотека анимаций для React.

Используется для микроанимаций, которые создают ощущение premium-продукта:
каскадное появление карточек, typewriter-эффект при AI-заполнении,
тактильное нажатие кнопок, переходы между экранами.

**Где используется:**
- Онбординг: typewriter-эффект при автозаполнении полей
- Daily Plan: каскадное появление карточек задач
- Везде: `whileTap={{ scale: 0.98 }}` на кнопках
- Переходы между шагами онбординга (slide left/right)

---

### React Hook Form + Zod

**Роль:** Управление формами и валидация данных.

React Hook Form управляет состоянием форм (значения полей, ошибки, dirty state)
без лишних ре-рендеров. Zod описывает схемы валидации, которые используются
и на клиенте (формы), и на сервере (Server Actions), и для AI (structured output).

**Где используется:**
- Онбординг: мультишаговая форма (ниша, оффер, чек, ЦА, CTA)
- Lead Tracker: добавление и редактирование лида
- Content Engine: редактирование черновика
- Server Actions: валидация входящих данных через Zod

**Почему React Hook Form, а не Conform или нативные формы:**
- Отличная интеграция с shadcn/ui Form компонентом
- `useForm` + `zodResolver` — декларативная валидация
- Контроль над UX: когда показывать ошибки, мультишаговость

---

### nuqs

**Роль:** Type-safe управление состоянием через URL query параметры.

Некоторые фильтры и состояния хранятся в URL, чтобы пользователь мог
обновить страницу и не потерять выбор, или поделиться ссылкой.

**Где используется:**
- Lead Tracker: фильтр по статусу (`?status=talking`)
- Content Engine: фильтр черновиков по углу и статусу (`?angle=pain&status=draft`)
- Analytics: выбранный период

---

## Стейт-менеджмент

### Философия: "Нет стейт-менеджера — лучший стейт-менеджер"

В Next.js 15 App Router большинство данных фетчится на сервере через
Server Components. Клиентский кэш серверных данных (TanStack Query, SWR)
не нужен — после Server Action вызывается `revalidatePath()`,
и данные актуализируются автоматически.

### Карта инструментов по типу состояния

| Тип состояния | Инструмент | Пример |
|---------------|-----------|--------|
| Данные из БД | Server Components + `revalidatePath` | Стратегия, план дня, лиды |
| Формы | React Hook Form + Zod | Онбординг, редактирование лида |
| Оптимистичные обновления | React 19 `useOptimistic` | Отметка задачи, смена статуса лида |
| Статус Server Action | React 19 `useActionState` / `useFormStatus` | Loading-состояние кнопок |
| Локальный UI | React `useState` | Модалки, editing mode, текущий шаг |
| URL-параметры | nuqs | Фильтры, сортировка |
| AI-стриминг | Vercel AI SDK хуки | Typewriter, генерация черновика |
| Тосты | Sonner | Уведомления об успехе/ошибке |

### Почему без Zustand / Jotai / Redux

На этапе MVP нет потребности в глобальном клиентском сторе:
- Нет сложного cross-page клиентского состояния (данные на сервере)
- Нет real-time коллаборации (solo-пользователь)
- Нет offline-mode / PWA

Если в будущем появится потребность (командный режим, offline, сложные wizards),
рекомендуется **Zustand** — минимальный API, без бойлерплейта, хорошо работает с RSC.

---

## Backend

### Next.js Server Actions

**Роль:** Основной API-слой для мутаций данных.

Server Actions — это асинхронные серверные функции, вызываемые напрямую
из клиентских компонентов. Заменяют REST API endpoints для большинства операций.

**Где используется:**
- Сохранение шагов онбординга
- Отметка выполнения задач в Daily Plan
- CRUD операции с лидами
- Сохранение/редактирование черновиков
- Обновление стратегии

**Преимущества:**
- Type-safe от формы до БД — один TypeScript на всём пути
- Автоматический `revalidatePath` / `revalidateTag` после мутации
- Нет необходимости писать fetch, обрабатывать HTTP-коды

---

### next-safe-action

**Роль:** Type-safe обёртка для Server Actions с валидацией и обработкой ошибок.

Добавляет Zod-валидацию входных данных, middleware (проверка авторизации),
и стандартизированный формат ответа (success / error).

**Пример:**
```ts
const updateLead = authAction
  .schema(updateLeadSchema) // Zod-валидация
  .action(async ({ parsedInput, ctx }) => {
    // ctx.userId — из middleware авторизации
    await db.update(leads).set(parsedInput).where(eq(leads.userId, ctx.userId))
    revalidatePath('/leads')
  })
```

---

### Hono (опционально)

**Роль:** Легковесный HTTP-фреймворк для webhook-эндпоинтов.

Server Actions не подходят для входящих вебхуков от внешних сервисов.
Для Stripe webhooks и потенциальных Threads webhooks используется Hono
внутри Next.js API routes.

**Где используется:**
- `app/api/webhooks/stripe/route.ts` — обработка платежей
- `app/api/webhooks/threads/route.ts` — (будущее) уведомления от Threads API

---

## База данных

### PostgreSQL

**Роль:** Основная реляционная база данных.

PostgreSQL хранит все данные приложения: пользователей, стратегии, ежедневные планы,
черновики, лидов, аналитику. Выбран за надёжность, расширяемость и зрелость экосистемы.

**Хостинг:** Neon (serverless PostgreSQL) или Supabase (hosted PostgreSQL).

**Почему PostgreSQL:**
- Реляционная модель идеально подходит для связей: User → Strategy → DailyPlan → Tasks
- JSONB-поля для гибких данных (результат AI-анализа, метаданные постов Threads)
- Проверенная технология, огромное сообщество
- Отличная поддержка в Drizzle ORM

---

### Drizzle ORM

**Роль:** Type-safe ORM для работы с PostgreSQL.

Drizzle — SQL-first ORM, где схема описывается на TypeScript, а запросы
максимально близки к SQL. Типы автоматически выводятся из схемы.

**Почему Drizzle, а не Prisma:**
- Нет этапа `prisma generate` — схема это обычный TypeScript
- Быстрее холодного старта на serverless (Vercel) — нет бинарного engine
- SQL-first: если знаешь SQL, знаешь Drizzle
- Легче (меньше node_modules)
- Drizzle Kit — автоматические миграции из схемы

**Пример схемы:**
```ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadsId: text('threads_id').unique(),
  name: text('name').notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const strategies = pgTable('strategies', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  niche: text('niche'),
  offer: text('offer'),
  averageCheck: integer('average_check'),
  targetClient: text('target_client'),
  cta: text('cta'), // 'dm' | 'call' | 'link' | 'custom'
  confirmedAt: timestamp('confirmed_at'),
})
```

---

## Аутентификация

### Better Auth

**Роль:** Аутентификация и управление сессиями.

Better Auth — это TypeScript-first библиотека аутентификации, работающая
с любой БД. Поддерживает OAuth-провайдеры, включая Meta (для Threads)
и Google (для Gmail).

**Почему Better Auth:**
- Полная независимость от конкретного хостинга БД
- Нативная поддержка Meta OAuth (Threads) и Google OAuth (Gmail)
- Данные сессий хранятся в нашей PostgreSQL — полный контроль
- TypeScript-first, отличная типизация
- Поддержка JWT и database sessions
- Поддержка привязки нескольких OAuth-провайдеров к одному аккаунту (account linking)

**OAuth-провайдеры:**

| Провайдер | Назначение | Scopes |
|-----------|-----------|--------|
| **Meta (Threads)** | Основной вход + доступ к Threads API | `threads_basic`, `threads_content_publish`, `threads_manage_insights` |
| **Google (Gmail)** | Альтернативный вход | `email`, `profile` |

**Флоу авторизации через Threads:**
1. Пользователь нажимает "Войти через Threads"
2. Редирект на Meta OAuth
3. Callback → Better Auth создаёт/обновляет пользователя в PostgreSQL
4. Сессия сохраняется, `access_token` и `refresh_token` для Threads API — в БД
5. Новый пользователь → Onboarding (шаг Threads уже пройден)

**Флоу авторизации через Gmail:**
1. Пользователь нажимает "Войти через Gmail"
2. Редирект на Google OAuth
3. Callback → Better Auth создаёт/обновляет пользователя в PostgreSQL
4. Сессия сохраняется, email и имя из Google-профиля — в БД
5. Новый пользователь → Onboarding (с предложением подключить Threads)

**Account Linking:**
- Пользователь, вошедший через Gmail, может позже привязать Threads
- Threads-аккаунт связывается с существующим user через Better Auth account linking
- После привязки — доступ к полному функционалу (анализ контента, аналитика)

---

## AI / LLM

### Vercel AI SDK

**Роль:** Единый интерфейс для работы с LLM-провайдерами.

Vercel AI SDK предоставляет React-хуки и серверные утилиты для стриминга,
structured output и tool calling. Поддерживает OpenAI, Anthropic и другие
провайдеры через единый API.

**Где используется:**
- **`useObject`** — structured output при анализе профиля Threads
  (возвращает `{ niche, offer, targetClient, cta }` по Zod-схеме)
- **`useCompletion`** — стриминг генерации черновика (typewriter-эффект)
- **`generateObject`** (сервер) — генерация стратегии, рекомендация угла
- **`generateText`** (сервер) — генерация текста черновика

**Почему Vercel AI SDK:**
- Единый API — можно переключить провайдер (OpenAI → Anthropic) одной строкой
- Стриминг из коробки — критически важно для typewriter UX
- Structured output через Zod — AI возвращает типизированные объекты, не строки
- React-хуки с автоматическим управлением состоянием стриминга

---

### OpenAI GPT-4o-mini

**Роль:** Основная LLM-модель для AI-функций.

GPT-4o-mini — быстрая и экономичная модель, достаточно мощная для задач PipelineHQ:
классификация ниши, определение оффера, генерация коротких постов до 500 символов.

**Где используется:**
- Smart Onboarding: анализ постов Threads → определение ниши, оффера, ЦА, CTA
- Content Engine: генерация черновиков по углам (pain / case / belief / objection)
- Daily Plan: генерация conversion action на основе CTA пользователя
- Рекомендация угла на основе истории публикаций

**Стоимость:**
- При 50 пользователях, ~3–5 AI-вызовов в день на пользователя: ~$5–15/мес
- Для сложных задач (генерация полной стратегии) — fallback на GPT-4o

---

## Интеграции

### Meta Threads API

**Роль:** Получение данных профиля и контента пользователя из Threads.

Threads API (через Meta for Developers) используется для OAuth-авторизации
и получения публичных данных профиля: bio, посты, ссылки.

**Используемые endpoints:**
- OAuth: авторизация и получение access_token
- User Profile: bio, username, followers count
- User Threads: последние 20–50 постов пользователя
- Thread Insights: метрики постов (views, likes, replies)

**Ограничения:**
- Rate limits на API-запросы
- Ограниченный набор доступных данных
- Необходимо получить доступ через Meta for Developers
- Fallback на ручной ввод, если API недоступен

**Реализация:**
Кастомная TypeScript-обёртка над fetch с типизированными ответами
и обработкой rate limits.

---

## Инфраструктура и деплой

### Vercel

**Роль:** Хостинг и деплой приложения.

Vercel — платформа от создателей Next.js, с нативной поддержкой всех фич:
Server Components, Server Actions, Edge Functions, Streaming.

**Возможности:**
- Автоматический деплой из GitHub (push → preview → production)
- Preview deployments для каждого PR
- Edge Functions для быстрых ответов
- Встроенные Cron Jobs (для генерации Daily Plan)
- Web Analytics и Speed Insights

---

### Upstash Redis

**Роль:** Rate limiting и кэширование.

Serverless Redis для ограничения частоты запросов к внешним API
и кэширования данных, которые не нужно запрашивать каждый раз.

**Где используется:**
- Rate limiting запросов к OpenAI API (не более N генераций в день на пользователя)
- Rate limiting запросов к Threads API
- Кэширование сгенерированного Daily Plan до конца дня
- Кэширование результатов анализа профиля Threads

---

### Upstash QStash

**Роль:** Запланированные задачи (CRON) и фоновые задачи.

QStash позволяет запускать HTTP-вызовы по расписанию и выполнять
долгие задачи в фоне (без ожидания ответа от пользователя).

**Где используется:**
- Генерация Daily Growth Plan каждый день в 00:00 по таймзоне пользователя
- Фоновый анализ контента Threads при онбординге (может занять 10–30 секунд)
- Обновление аналитики по расписанию

**Альтернатива:** Vercel Cron — подходит для простых задач с фиксированным расписанием.

---

## Мониторинг

### Sentry

**Роль:** Отслеживание ошибок в продакшене.

Автоматически ловит runtime-ошибки на клиенте и сервере,
с полным стек-трейсом и контекстом (браузер, пользователь, действие).

**Почему важен:**
- MVP-фаза — критически важно быстро находить и чинить баги
- Интеграция с Vercel и Next.js из коробки
- Source maps для читаемых стек-трейсов

---

### PostHog

**Роль:** Продуктовая аналитика и фичевые флаги.

Отслеживает пользовательское поведение для измерения ключевых метрик MVP.

**Что отслеживается:**
- Completion rate онбординга (цель: >80%)
- Retention — возврат к дневному плану через 7 дней (цель: >60%)
- Воронка: онбординг → первый план → первая публикация → первый лид
- Какие углы контента используются чаще
- Где пользователи "отваливаются"

**Почему PostHog:**
- Бесплатный тир: 1M событий/мес — более чем достаточно для 50 пользователей
- Self-serve: не нужен аналитик для настройки
- Feature flags — можно постепенно раскатывать новые фичи

---

## Платежи

### Stripe (Payment Links)

**Роль:** Приём оплаты.

В MVP оплата происходит через Stripe Payment Links — ручной онбординг
платящих пользователей без полной интеграции платёжной системы.

**Почему Payment Links, а не полная интеграция:**
- Минимум кода — генерируем ссылку в Stripe Dashboard
- Достаточно для 30–50 пользователей
- Webhook для подтверждения оплаты
- Полная интеграция (Stripe Elements, подписки) — после валидации MVP

---

## Email (опционально)

### Resend + React Email

**Роль:** Транзакционные email-уведомления.

Resend — сервис отправки email. React Email — компоненты для вёрстки писем
на React (тот же стек, что и UI).

**Где используется (опционально для MVP):**
- Приветственное письмо после регистрации
- Ежедневное напоминание о Daily Plan (если пользователь не заходил)
- Еженедельный отчёт о прогрессе

---

## Структура проекта

```
pipelinehq/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Login, OAuth callbacks
│   │   │   ├── login/page.tsx
│   │   │   ├── callback/threads/route.ts
│   │   │   └── callback/google/route.ts
│   │   ├── (onboarding)/           # Шаги онбординга
│   │   │   └── onboarding/
│   │   │       └── [[...step]]/page.tsx
│   │   ├── (dashboard)/            # Основной интерфейс
│   │   │   ├── layout.tsx          # AppLayout (sidebar + bottom nav)
│   │   │   ├── page.tsx            # Dashboard / Daily Plan
│   │   │   ├── plan/page.tsx       # Daily Growth Plan
│   │   │   ├── drafts/page.tsx     # Content Draft Engine
│   │   │   ├── analytics/page.tsx  # Basic Analytics
│   │   │   ├── leads/page.tsx      # Lead Tracker
│   │   │   └── strategy/page.tsx   # Стратегия (просмотр/ред.)
│   │   ├── api/                    # Webhook endpoints, AI routes
│   │   │   ├── webhooks/
│   │   │   └── ai/
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # CSS variables, Tailwind base
│   ├── components/
│   │   ├── ui/                     # shadcn/ui (Button, Card, Input...)
│   │   ├── onboarding/             # ThreadsConnect, NicheStep, SummaryScreen
│   │   ├── plan/                   # TaskCard, StreakBadge, DailyPlan
│   │   ├── drafts/                 # DraftEditor, AngleSelector, DraftList
│   │   ├── leads/                  # LeadTable, LeadForm, StatusBadge
│   │   └── shared/                 # AppLayout, BottomTabBar, AIBadge
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts           # Drizzle schema (все таблицы)
│   │   │   ├── index.ts            # DB connection
│   │   │   └── queries/            # Переиспользуемые запросы
│   │   ├── ai/
│   │   │   ├── prompts.ts          # Промпты для всех AI-задач
│   │   │   ├── analyze-profile.ts  # Анализ контента Threads
│   │   │   └── generate-draft.ts   # Генерация черновиков
│   │   ├── threads/
│   │   │   ├── client.ts           # Threads API обёртка
│   │   │   └── types.ts            # Типы ответов Threads API
│   │   ├── auth.ts                 # Конфигурация Better Auth
│   │   └── utils.ts                # cn(), форматирование, хелперы
│   ├── actions/                    # Server Actions
│   │   ├── onboarding.ts
│   │   ├── plan.ts
│   │   ├── drafts.ts
│   │   └── leads.ts
│   └── types/                      # Общие типы и Zod-схемы
│       └── index.ts
├── drizzle/                        # Миграции Drizzle
├── ai_docs/                        # Документация проекта
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                      # Переменные окружения
```

---

## Переменные окружения

```env
# Database
DATABASE_URL=postgresql://...

# Auth (Meta OAuth + Google OAuth)
META_CLIENT_ID=
META_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# AI
OPENAI_API_KEY=

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# QStash
QSTASH_TOKEN=

# Stripe
STRIPE_WEBHOOK_SECRET=

# Monitoring
NEXT_PUBLIC_POSTHOG_KEY=
SENTRY_DSN=

# Email (опционально)
RESEND_API_KEY=
```

---

## Версии (рекомендуемые)

| Пакет | Версия |
|-------|--------|
| next | ^15.x |
| react | ^19.x |
| typescript | ^5.x |
| tailwindcss | ^4.x |
| drizzle-orm | ^0.38.x |
| better-auth | ^1.x |
| ai (Vercel AI SDK) | ^4.x |
| framer-motion | ^12.x |
| react-hook-form | ^7.x |
| zod | ^3.x |
| nuqs | ^2.x |
| @sentry/nextjs | ^9.x |
| posthog-js | ^1.x |
