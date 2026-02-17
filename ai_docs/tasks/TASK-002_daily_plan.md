# TASK-002: Задачи — Daily Growth Plan

## Связанные User Stories
- US-002.1 — US-002.6

---

## Backend задачи

### TASK-002-B1: Модель данных дневного плана
- Создать модель `DailyPlan`:
  - `user_id: FK`
  - `date: date`
  - `publish_draft_id: FK → ContentDraft`
  - `publish_completed: boolean`
  - `publish_completed_at: timestamp (nullable)`
  - `engagement_tasks: json[]` — массив из 5 задач
  - `engagement_completed_count: integer`
  - `conversion_action: text`
  - `conversion_type: enum (dm, call, link)`
  - `conversion_completed: boolean`
  - `conversion_result: enum (no_response, responded, lead, rejected) (nullable)`
  - `completion_percentage: decimal`
- Создать модель `EngagementTask`:
  - `daily_plan_id: FK`
  - `description: text`
  - `hashtag_or_topic: string`
  - `suggested_comment: text`
  - `threads_link: string (nullable)`
  - `completed: boolean`
- Миграции БД
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-002.1

---

### TASK-002-B2: Сервис генерации дневного плана
- Сервис `DailyPlanGenerator`:
  - Вызывается ежедневно (cron job) или при первом входе за день
  - На основе стратегии из onboarding генерирует:
    1. Черновик поста (через Content Draft Engine)
    2. 5 engagement-задач (хештеги/темы в нише + шаблоны комментариев)
    3. 1 conversion action (на основе CTA пользователя)
  - Учитывает историю: не повторять углы подряд
  - Учитывает день недели (weekend = легче)
- **Приоритет:** 🔴 Critical
- **Оценка:** 6h
- **User Story:** US-002.1, US-002.2, US-002.3, US-002.4

---

### TASK-002-B3: API — Daily Plan endpoints
- `GET /api/daily-plan/today` — план на сегодня
  - Если нет — генерирует
  - Возвращает: draft, engagement tasks, conversion action
- `PUT /api/daily-plan/today/publish` — отметка публикации
- `PUT /api/daily-plan/today/engagement/:id` — отметка engagement задачи
- `PUT /api/daily-plan/today/conversion` — отметка conversion + результат
- `POST /api/daily-plan/today/regenerate-draft` — перегенерация черновика
  - Лимит: 3 раза в день
- `GET /api/daily-plan/history` — история планов (для streak)
  - Параметры: from, to
  - Возвращает: массив планов с completion_percentage
- `GET /api/daily-plan/streak` — текущий streak
- **Приоритет:** 🔴 Critical
- **Оценка:** 5h
- **User Story:** US-002.1 — US-002.6

---

### TASK-002-B4: Cron job — генерация планов
- Ежедневный cron job для генерации планов
- Учёт часового пояса пользователя
- Генерация только для активных пользователей
- **Приоритет:** 🟡 High
- **Оценка:** 2h
- **User Story:** US-002.1

---

### TASK-002-B5: Сервис streak и статистики выполнения
- Подсчёт streak (последовательные дни с completion > 0)
- Процент выполнения за неделю / месяц
- Определение "выполненного дня" (минимум 2 из 3 задач)
- **Приоритет:** 🟡 High
- **Оценка:** 3h
- **User Story:** US-002.5

---

## Frontend задачи

### TASK-002-F1: UI — Dashboard с дневным планом
- Главный экран после онбординга
- 3 карточки:
  - 📝 **Публикация** — черновик, кнопки "Редактировать", "Скопировать", "Опубликовано"
  - 💬 **Engagement** — 5 пунктов с чекбоксами
  - 🎯 **Conversion** — описание действия, чекбокс + результат
- Прогресс-бар (0/3 → 3/3)
- Приветствие: "Привет, [Имя]! Вот твой план на сегодня"
- Текущий streak сверху: "🔥 5 дней подряд"
- Mobile-first
- **Приоритет:** 🔴 Critical
- **Оценка:** 8h
- **User Story:** US-002.1

---

### TASK-002-F2: UI — Карточка публикации
- Превью черновика (первые 3 строки)
- Кнопка "Развернуть" для полного просмотра
- Inline-редактирование
- Счётчик символов (лимит Threads — 500)
- Кнопки:
  - "📋 Скопировать"
  - "🔄 Другой черновик" (перегенерация, лимит 3/день)
  - "✅ Опубликовано"
- После отметки "Опубликовано" — карточка становится зелёной
- **Приоритет:** 🔴 Critical
- **Оценка:** 4h
- **User Story:** US-002.2

---

### TASK-002-F3: UI — Карточка Engagement
- Список из 5 задач
- Каждая задача:
  - Тема/хештег
  - Подсказка (шаблон комментария)
  - Ссылка на Threads (если доступно)
  - Чекбокс выполнения
- Счётчик: "3/5 выполнено"
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-002.3

---

### TASK-002-F4: UI — Карточка Conversion Action
- Описание действия (развёрнуто)
- Шаблон сообщения для DM / предложения
- Чекбокс "Выполнено"
- При выполнении — dropdown результата:
  - Нет ответа
  - Ответил
  - Заявка → кнопка "Добавить лид"
  - Отказ
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-002.4

---

### TASK-002-F5: UI — Streak и история
- Streak-бейдж в header dashboard
- Страница истории:
  - Календарь (цвет дня по completion %)
  - Список дней со статистикой
- Мотивационные сообщения:
  - 3 дня: "Отличное начало! 🎉"
  - 7 дней: "Целая неделя! 🔥"
  - 14 дней: "Две недели подряд! 💪"
  - 30 дней: "Месяц! Ты машина! 🚀"
- **Приоритет:** 🟡 High
- **Оценка:** 4h
- **User Story:** US-002.5

---

### TASK-002-F6: UI — Перегенерация и пропуск
- Кнопка "🔄 Другой черновик" с лимитом (показывать оставшиеся)
- Кнопка "⏭ Пропустить" для любого блока
- Модальное окно: "Пропустить задачу? Она не будет засчитана"
- **Приоритет:** 🟢 Medium
- **Оценка:** 2h
- **User Story:** US-002.6

---

## Суммарная оценка модуля

| Тип | Задачи | Часы |
|-----|--------|------|
| Backend | B1–B5 | ~19h |
| Frontend | F1–F6 | ~24h |
| **Итого** | **11 задач** | **~43h** |
