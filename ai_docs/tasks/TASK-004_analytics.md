# TASK-004: Задачи — Basic Analytics

## Связанные User Stories
- US-004.1 — US-004.5

---

## Backend задачи

### TASK-004-B1: Модель данных аналитики
- Создать модель `PostAnalytics`:
  - `draft_id: FK → ContentDraft`
  - `user_id: FK`
  - `threads_post_id: string (nullable)` — ID поста в Threads
  - `followers_before: integer (nullable)`
  - `followers_after: integer (nullable)`
  - `followers_delta: integer (computed)`
  - `comments_count: integer`
  - `profile_clicks: integer (nullable)`
  - `reposts_count: integer (nullable)`
  - `quotes_count: integer (nullable)`
  - `led_to_dialogue: boolean`
  - `dialogue_count: integer (nullable)`
  - `led_to_lead: boolean`
  - `lead_ids: FK[] → Lead (nullable)`
  - `data_source: enum (api, manual)` — откуда данные
  - `recorded_at: timestamp`
- Миграция БД
- **Приоритет:** 🔴 Critical
- **Оценка:** 2h
- **User Story:** US-004.1

---

### TASK-004-B2: Сервис сбора метрик из Threads API
- Сервис `ThreadsMetricsCollector`:
  - Для каждого опубликованного поста:
    - Запрашивает метрики через Threads API (если доступны)
    - comments_count, reposts, quotes
    - profile_clicks (если доступно)
  - Запрашивает followers_count текущий
  - Сохраняет дельту подписчиков
  - Cron: обновление метрик через 24h и 72h после публикации
- Обработка:
  - API не даёт метрику → поле null, пользователь вводит вручную
  - Rate limits → queue с retry
- **Приоритет:** 🟡 High
- **Оценка:** 5h
- **User Story:** US-004.1

---

### TASK-004-B3: API — Analytics endpoints
- `GET /api/analytics/posts` — аналитика по всем постам
  - Фильтры: date range, angle
  - Пагинация
- `GET /api/analytics/posts/:draft_id` — аналитика конкретного поста
- `PUT /api/analytics/posts/:draft_id` — ручное обновление метрик
  - Принимает: `{ followers_before, followers_after, comments_count, profile_clicks }`
- `PUT /api/analytics/posts/:draft_id/dialogue` — отметка "привёл к диалогу"
  - Принимает: `{ led_to_dialogue, dialogue_count, led_to_lead }`
- `GET /api/analytics/summary` — сводка за период
  - Параметры: period (7d, 30d, all)
  - Возвращает: totals, growth, conversion rates
- `GET /api/analytics/best-post` — лучший пост за период
- `GET /api/analytics/by-angle` — разбивка по углам контента
- **Приоритет:** 🔴 Critical
- **Оценка:** 5h
- **User Story:** US-004.1 — US-004.5

---

### TASK-004-B4: Сервис агрегации аналитики
- Расчёт сводных метрик:
  - Всего постов за период
  - Рост подписчиков (суммарный)
  - Всего комментариев
  - Постов → диалогов (конверсия %)
  - Разбивка по углам
- Определение лучшего поста (по комментариям + диалогам)
- Кэширование агрегатов (обновление при изменении данных)
- **Приоритет:** 🟡 High
- **Оценка:** 3h
- **User Story:** US-004.3, US-004.4, US-004.5

---

## Frontend задачи

### TASK-004-F1: UI — Метрики поста
- На странице каждого поста / в списке постов:
  - Подписчики: +12 (до: 340, после: 352)
  - Комментарии: 8
  - Профиль-клики: 23 (или "—" если нет данных)
  - Репосты: 3
- Если данных нет (API не вернул) → поля для ручного ввода
- Подсказка: "Введите данные из Threads вручную"
- **Приоритет:** 🔴 Critical
- **Оценка:** 4h
- **User Story:** US-004.1

---

### TASK-004-F2: UI — Отметка "Привёл к диалогу"
- Переключатель: "Привёл к диалогу? 💬 Да / ❌ Нет"
- При "Да":
  - Поле: "Сколько диалогов?" (число)
  - Переключатель: "Привёл к заявке?"
  - Если заявка → кнопка "Добавить лид в трекер"
- Визуальная метка в списке постов: 💬 / ❌ / без метки
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-004.2

---

### TASK-004-F3: UI — Дашборд аналитики
- Страница "Аналитика"
- Переключатель периода: 7 дней / 30 дней / всё время
- Метрики-карточки:
  - 📝 Постов опубликовано: X
  - 📈 Рост подписчиков: +Y (график)
  - 💬 Комментариев: Z
  - 🎯 Постов → диалогов: N (W%)
- Простой линейный график роста подписчиков
- Не нужен сложный BI — минималистичные показатели
- **Приоритет:** 🟡 High
- **Оценка:** 5h
- **User Story:** US-004.3

---

### TASK-004-F4: UI — Лучший пост
- Блок на дашборде аналитики:
  - "🏆 Лучший пост за период"
  - Текст поста (превью)
  - Угол (badge)
  - Метрики
  - Подсказка: "Попробуй написать ещё один пост в этом стиле"
- **Приоритет:** 🟢 Medium
- **Оценка:** 2h
- **User Story:** US-004.4

---

### TASK-004-F5: UI — Аналитика по углам
- Таблица или бар-чарт:
  - Pain: avg комментариев X, диалогов Y
  - Case: avg комментариев X, диалогов Y
  - Belief: avg комментариев X, диалогов Y
  - Objection: avg комментариев X, диалогов Y
- Подсветка лучшего угла
- Подсказка: "Ваш лучший угол — Case. Используйте его чаще!"
- **Приоритет:** 🟢 Medium
- **Оценка:** 3h
- **User Story:** US-004.5

---

## Суммарная оценка модуля

| Тип | Задачи | Часы |
|-----|--------|------|
| Backend | B1–B4 | ~15h |
| Frontend | F1–F5 | ~17h |
| **Итого** | **9 задач** | **~32h** |
