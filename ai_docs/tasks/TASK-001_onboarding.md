# TASK-001: Задачи — Smart Onboarding

## Связанные User Stories
- US-001.1 — US-001.8

---

## Backend задачи

### TASK-001-B1: Модель данных пользователя
- Создать модель `UserProfile`:
  - `niche: string`
  - `offer: text`
  - `average_check: decimal`
  - `currency: enum (USD, EUR, RUB)`
  - `target_client: text`
  - `cta_type: enum (dm, call, link, custom)`
  - `cta_custom: string (nullable)`
  - `threads_username: string`
  - `threads_profile_url: string (nullable)`
  - `auto_filled_fields: json` — какие поля были автозаполнены
  - `onboarding_step: integer` — текущий шаг онбординга
  - `onboarding_completed: boolean`
  - `onboarding_completed_at: timestamp (nullable)`
- Миграция БД
- **Приоритет:** 🔴 Critical
- **Оценка:** 2h
- **User Story:** US-001.1, US-001.8

---

### TASK-001-B2: Интеграция с Threads API — получение данных профиля
- Сервис `ThreadsProfileFetcher`:
  - Авторизация через Meta OAuth 2.0 (Threads API)
  - Получение данных профиля: bio, username, followers_count
  - Получение последних 20–50 постов (text, timestamp, metrics)
  - Получение ссылок из bio
- Возвращает: `{ bio, posts[], links[], followers_count }`
- Обработка ошибок:
  - API недоступен → fallback на ручной ввод
  - Rate limit → retry с backoff
  - Приватный профиль → сообщение пользователю
- **Приоритет:** 🔴 Critical
- **Оценка:** 8h
- **User Story:** US-001.1

---

### TASK-001-B3: Сервис анализа контента (Content Analyzer)
- На вход: `{ bio, posts[], links[] }`
- На выход: `{ niche, offer, average_check, target_client, cta_type, confidence_scores }`
- Логика:
  - LLM-промпт для извлечения ниши, оффера, ЦА из текстов постов Threads
  - Regex/парсинг для цен (упоминания $, €, ₽)
  - Парсинг ссылок: Calendly → call, Stripe → link, "пишите в DM" → dm
  - Confidence score для каждого поля (заполнять только если > 0.6)
- Промпт должен учитывать формат Threads (короткие тексты)
- **Приоритет:** 🔴 Critical
- **Оценка:** 6h
- **User Story:** US-001.2, US-001.3, US-001.4, US-001.5

---

### TASK-001-B4: API — Onboarding endpoints
- `POST /api/onboarding/connect-threads` — подключение Threads, запуск анализа
  - Принимает: OAuth token
  - Возвращает: статус "analyzing" / "ready" / "error"
- `GET /api/onboarding/suggestions` — получение автозаполненных данных
  - Возвращает: `{ niche, offer, average_check, target_client, cta_type, confidence_scores }`
- `PUT /api/onboarding/step/:step` — сохранение данных шага
  - Принимает: данные текущего шага
  - Сохраняет прогресс
- `PUT /api/onboarding/confirm` — подтверждение всех данных
  - Принимает: финальные данные
  - Возвращает: `{ strategy }`
- `GET /api/onboarding/strategy` — получение стратегии
- `GET /api/onboarding/progress` — текущий шаг (для восстановления сессии)
- Валидация входных данных на каждом endpoint
- **Приоритет:** 🔴 Critical
- **Оценка:** 5h
- **User Story:** US-001.1 — US-001.8

---

### TASK-001-B5: Генерация стратегии
- Сервис `StrategyGenerator`:
  - На вход: подтверждённые данные из onboarding
  - На выход: стратегия
- Стратегия включает:
  - Позиционирование в Threads (1–2 предложения)
  - Рекомендуемые углы контента (на основе ниши)
  - CTA-формулировка (шаблон для постов)
  - Рекомендуемая частота (ежедневно / 3–5 раз в неделю)
  - Рекомендуемые хештеги для Threads
- MVP: LLM-промпт с шаблоном
- **Приоритет:** 🟡 High
- **Оценка:** 4h
- **User Story:** US-001.7

---

## Frontend задачи

### TASK-001-F1: UI — Экран подключения Threads
- Экран с логотипом Threads
- Кнопка "Подключить Threads" → OAuth flow
- Состояние загрузки: "Анализируем ваш контент в Threads..." (с анимацией)
- Индикатор прогресса анализа
- Кнопка "Пропустить — заполню вручную"
- Обработка ошибок: "Не удалось подключить → попробуйте снова или заполните вручную"
- **Приоритет:** 🔴 Critical
- **Оценка:** 4h
- **User Story:** US-001.1

---

### TASK-001-F2: UI — Wizard с предзаполненными полями
- Пошаговая форма (шаги 1–5):
  1. Ниша
  2. Оффер + Средний чек
  3. Целевой клиент
  4. CTA
  5. Подтверждение
- Каждое поле:
  - Предзаполнено, если есть suggestion
  - Метка: "🤖 Определено из вашего Threads" (для автозаполненных)
  - Поле полностью редактируемое
  - Если пустое: плейсхолдер + примеры
- Прогресс-бар сверху
- Валидация на каждом шаге
- Кнопки "Назад" / "Далее"
- Mobile-first responsive дизайн
- **Приоритет:** 🔴 Critical
- **Оценка:** 8h
- **User Story:** US-001.2, US-001.3, US-001.4, US-001.5

---

### TASK-001-F3: UI — Summary-экран подтверждения
- Все 5 полей на одном экране (карточки)
- Inline-edit по клику на каждое поле
- Визуальное различие:
  - 🤖 "Заполнено автоматически" — иконка AI
  - ✏️ "Изменено вами" — иконка ручки
- Кнопка "Подтвердить и получить стратегию"
- Валидация: все обязательные поля заполнены
- **Приоритет:** 🟡 High
- **Оценка:** 4h
- **User Story:** US-001.6

---

### TASK-001-F4: UI — Экран стратегии
- Красивое отображение стратегии (карточки / секции):
  - Позиционирование
  - Типы контента
  - CTA-формулировка
  - Частота публикаций
  - Хештеги
- Кнопка "🚀 Начать" → переход к Dashboard / Daily Growth Plan
- Возможность скачать стратегию (PDF / text)
- **Приоритет:** 🟡 High
- **Оценка:** 4h
- **User Story:** US-001.7

---

### TASK-001-F5: Сохранение прогресса онбординга
- При каждом переходе между шагами — автосохранение на сервер
- При повторном входе — API `GET /onboarding/progress` → восстановление
- Fallback: localStorage для мгновенного восстановления
- **Приоритет:** 🟢 Medium
- **Оценка:** 2h
- **User Story:** US-001.8

---

## Суммарная оценка модуля

| Тип | Задачи | Часы |
|-----|--------|------|
| Backend | B1–B5 | ~25h |
| Frontend | F1–F5 | ~22h |
| **Итого** | **10 задач** | **~47h** |
