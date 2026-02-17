# TASK-005: Задачи — Lead Tracker Lite

## Связанные User Stories
- US-005.1 — US-005.6

---

## Backend задачи

### TASK-005-B1: Модель данных лидов
- Создать модель `Lead`:
  - `user_id: FK`
  - `name: string`
  - `threads_username: string (nullable)`
  - `source: enum (comment, dm, reply, other)`
  - `source_post_id: FK → ContentDraft (nullable)`
  - `status: enum (new, talking, call, won, lost)`
  - `deal_amount: decimal (nullable)` — сумма сделки (при won)
  - `lost_reason: string (nullable)` — причина отказа (при lost)
  - `created_at: timestamp`
  - `updated_at: timestamp`
- Создать модель `LeadNote`:
  - `lead_id: FK`
  - `text: text`
  - `created_at: timestamp`
- Миграции БД
- **Приоритет:** 🔴 Critical
- **Оценка:** 2h
- **User Story:** US-005.1

---

### TASK-005-B2: API — Lead CRUD endpoints
- `POST /api/leads` — создание лида
  - Принимает: `{ name, threads_username, source, source_post_id, note }`
  - Валидация: name обязательно
- `GET /api/leads` — список лидов
  - Фильтры: status, source, date range
  - Сортировка: по дате, по статусу
  - Поиск: по имени / username
  - Пагинация
- `GET /api/leads/:id` — конкретный лид
- `PUT /api/leads/:id` — обновление лида
- `PUT /api/leads/:id/status` — изменение статуса
  - Принимает: `{ status, deal_amount (optional), lost_reason (optional) }`
  - При статусе "won" → deal_amount рекомендуется
  - При статусе "lost" → lost_reason рекомендуется
- `DELETE /api/leads/:id` — удаление лида
- **Приоритет:** 🔴 Critical
- **Оценка:** 4h
- **User Story:** US-005.1, US-005.2, US-005.3

---

### TASK-005-B3: API — Заметки к лиду
- `POST /api/leads/:id/notes` — добавление заметки
  - Принимает: `{ text }`
- `GET /api/leads/:id/notes` — список заметок лида
  - Сортировка: по дате (новые первые)
- `DELETE /api/leads/:id/notes/:note_id` — удаление заметки
- **Приоритет:** 🟡 High
- **Оценка:** 2h
- **User Story:** US-005.6

---

### TASK-005-B4: API — Сводка по воронке
- `GET /api/leads/summary` — сводка
  - Параметры: period (30d, all)
  - Возвращает:
    - total_leads: число
    - by_status: { new: X, talking: Y, call: Z, won: W, lost: L }
    - conversion_rate: leads → won (%)
    - total_revenue: сумма deal_amount по won
- `GET /api/leads/by-post/:draft_id` — лиды от конкретного поста
- **Приоритет:** 🟡 High
- **Оценка:** 3h
- **User Story:** US-005.4, US-005.5

---

## Frontend задачи

### TASK-005-F1: UI — Страница Lead Tracker
- Страница "Лиды"
- Мини-дашборд сверху:
  - Всего лидов: X
  - new: X / talking: X / call: X / won: X / lost: X
  - Конверсия: Y%
  - Выручка: $Z
- Таблица лидов:
  - Колонки: Имя, Источник, Пост, Статус, Дата, Последняя заметка (preview)
  - Строки кликабельные → карточка лида
- Фильтры: по статусу (tabs или dropdown)
- Поиск по имени
- Кнопка "+ Добавить лид"
- **Приоритет:** 🔴 Critical
- **Оценка:** 6h
- **User Story:** US-005.2, US-005.5

---

### TASK-005-F2: UI — Форма добавления лида
- Модальное окно / slide-over
- Поля:
  - Имя / Username (обязательно)
  - Источник: dropdown (комментарий / DM / ответ на пост / другое)
  - Связанный пост: dropdown (из списка опубликованных)
  - Заметка: textarea
- Быстрое добавление: минимум кликов
- Валидация: имя обязательно
- **Приоритет:** 🔴 Critical
- **Оценка:** 3h
- **User Story:** US-005.1

---

### TASK-005-F3: UI — Карточка лида
- Открывается по клику на строку в таблице
- Информация:
  - Имя / Username
  - Статус (dropdown для изменения)
  - Источник
  - Связанный пост (ссылка)
  - Дата создания
  - Сумма сделки (если won)
  - Причина отказа (если lost)
- Секция заметок:
  - Список заметок (по дате)
  - Форма добавления новой заметки
- **Приоритет:** 🔴 Critical
- **Оценка:** 4h
- **User Story:** US-005.3, US-005.4, US-005.6

---

### TASK-005-F4: UI — Изменение статуса
- Dropdown в таблице и в карточке лида
- Цветовая кодировка статусов:
  - 🆕 new — серый
  - 💬 talking — синий
  - 📞 call — жёлтый
  - ✅ won — зелёный
  - ❌ lost — красный
- При переходе в "won":
  - Popup: "Сумма сделки?" (необязательно)
  - Конфетти / анимация успеха 🎉
- При переходе в "lost":
  - Popup: "Причина?" (необязательно)
- **Приоритет:** 🟡 High
- **Оценка:** 3h
- **User Story:** US-005.3

---

### TASK-005-F5: UI — Быстрое добавление из Daily Plan
- В карточке Conversion Action (Daily Growth Plan):
  - При выборе результата "Заявка" → кнопка "Добавить лид"
  - Открывается форма добавления с предзаполненным источником
- Интеграция с US-002.4
- **Приоритет:** 🟢 Medium
- **Оценка:** 2h
- **User Story:** US-005.1

---

## Суммарная оценка модуля

| Тип | Задачи | Часы |
|-----|--------|------|
| Backend | B1–B4 | ~11h |
| Frontend | F1–F5 | ~18h |
| **Итого** | **9 задач** | **~29h** |
