# PipelineHQ — Design System (Threads-inspired + shadcn/ui)

## Стек UI

| Технология | Роль |
|-----------|------|
| **shadcn/ui** | Компонентная библиотека (копируемые компоненты) |
| **Tailwind CSS v4** | Утилитарные стили |
| **Radix UI** | Примитивы доступности (под капотом shadcn) |
| **Lucide Icons** | Иконки (встроены в shadcn) |
| **Inter** | Шрифт (через `next/font` или `@fontsource`) |
| **Framer Motion** | Микроанимации (typewriter, transitions) |

---

## Философия дизайна

**"Мягкость, глубина, премиум."**

Вдохновлён эстетикой Threads от Meta + premium-подход (Linear, Apple, Vercel):
- Минимализм — ничего лишнего, каждый элемент оправдан
- **Серо-матовый фон** — не белый, а приглушённый серый для ощущения дороговизны
- **Слоистость** — карточки "парят" над фоном, создавая глубину
- Пространство — щедрые отступы, контент "дышит"
- Типографика как UI — текст является главным элементом
- Мягкие формы — скруглённые углы, плавные переходы
- Контраст через вес шрифта — не чистый чёрный, а тёмно-угольный `#171717`
- **Мягкий контраст** — комфортный для глаз, не агрессивный

---

## Цветовая палитра

### Принципы
- **Серо-матовый фон** — не белый `#FFF`, а приглушённый `#F5F5F5` для premium-ощущения
- **Карточки светлее фона** — белые `#FFFFFF` карточки "парят" над серым фоном, создавая глубину
- **Тёмно-угольный текст** — не чистый чёрный `#000`, а мягкий `#171717` для комфортного контраста
- **Минимум цветов** — если можно решить угольным/серым/белым — решаем
- Цветовые акценты: AI (фиолетовый), Success (зелёный), Destructive (красный), Streak (оранжевый)

### Референсы палитры

| Продукт | Фон | Подход |
|---------|-----|--------|
| **Linear** | `#F8F8F8` | Инженерный премиум |
| **Vercel** | `#FAFAFA` | Чистый, дорогой |
| **Apple.com** | `#F5F5F7` | Тот самый Apple-серый |
| **Arc Browser** | `#F0F0F0` | Мягкий, premium |

### Light Mode (Premium Gray Matte)

| Роль | Цвет | HEX | Использование |
|------|-------|-----|---------------|
| Background | Матовый серый | `#F5F5F5` | Основной фон (НЕ белый) |
| Card / Surface | Белый | `#FFFFFF` | Карточки "парят" над фоном |
| Border | Серый | `#DEDEDE` | Тонкие разделители, обводки |
| Text Primary | Угольный | `#171717` | Заголовки, основной текст (НЕ чистый чёрный) |
| Text Secondary | Серый | `#737373` | Подписи, метаданные |
| Text Tertiary | Светло-серый | `#A3A3A3` | Хинты, плейсхолдеры |
| Primary (CTA) | Угольный | `#171717` | Кнопки, активные элементы |
| Primary Hover | Тёмный | `#2A2A2A` | Hover-состояние кнопок |
| Secondary | Светло-серый | `#EBEBEB` | Вторичные кнопки, фоны |
| Muted | Светло-серый | `#EBEBEB` | Неактивные элементы, фоны |
| Success | Зелёный | `#18A34A` | Выполнено, streak, подтверждение |
| AI Indicator | Фиолетовый | `#8B5CF6` | Метки "Заполнено AI" |
| AI Background | Светло-фиолет. | `#F3EEFF` | Фон AI-бейджа |
| Destructive | Красный | `#EF4444` | Ошибки, удаление (чуть мягче) |
| Streak | Оранжевый | `#F97316` | Streak / fire |

### Dark Mode (Deep Matte Black)

| Роль | Цвет | HEX | Использование |
|------|-------|-----|---------------|
| Background | Глубокий чёрный | `#121212` | Основной фон (матовый) |
| Card / Surface | Тёмно-серый | `#1A1A1A` | Карточки чуть светлее фона |
| Border | Серый | `#2E2E2E` | Тонкие разделители |
| Text Primary | Светлый | `#EDEDED` | Основной текст (НЕ чистый белый) |
| Text Secondary | Серый | `#8C8C8C` | Подписи, метаданные |

### Визуальное сравнение

**До (чистый белый)** — плоско, карточки сливаются с фоном:
```
┌─────────────────────────────────┐  фон: #FFFFFF
│  ┌───────────────────────────┐  │  карточка: #FAFAFA (еле видна)
│  │  📝 Публикация            │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**После (серый матовый)** — глубина, карточки "парят":
```
┌─────────────────────────────────┐  фон: #F5F5F5 (матовый серый)
│  ╔═══════════════════════════╗  │  карточка: #FFFFFF (белая, "приподнятая")
│  ║  📝 Публикация            ║  │
│  ╚═══════════════════════════╝  │
└─────────────────────────────────┘
```

---

## Конфигурация CSS Variables (shadcn/ui)

shadcn/ui использует CSS-переменные в формате HSL. Настройка через `globals.css`:

```css
@layer base {
  :root {
    /* Premium Gray Matte Light Theme */
    --background: 0 0% 96%;              /* #F5F5F5 — матовый серый фон (НЕ белый!) */
    --foreground: 0 0% 9%;               /* #171717 — тёмно-угольный (НЕ чистый чёрный) */

    --card: 0 0% 100%;                   /* #FFFFFF — белые карточки "парят" над серым */
    --card-foreground: 0 0% 9%;          /* #171717 */

    --popover: 0 0% 100%;               /* #FFFFFF */
    --popover-foreground: 0 0% 9%;

    --primary: 0 0% 9%;                  /* #171717 — угольные кнопки */
    --primary-foreground: 0 0% 98%;      /* #FAFAFA */

    --secondary: 0 0% 92%;               /* #EBEBEB */
    --secondary-foreground: 0 0% 9%;

    --muted: 0 0% 92%;                   /* #EBEBEB */
    --muted-foreground: 0 0% 45%;        /* #737373 */

    --accent: 0 0% 92%;                  /* #EBEBEB */
    --accent-foreground: 0 0% 9%;

    --destructive: 0 72% 51%;            /* #EF4444 — чуть мягче, чем #FF3B30 */
    --destructive-foreground: 0 0% 98%;

    --border: 0 0% 87%;                  /* #DEDEDE — чуть заметнее на сером фоне */
    --input: 0 0% 87%;                   /* #DEDEDE */
    --ring: 0 0% 9%;                     /* #171717 — focus ring угольный */

    --radius: 0.75rem;                   /* 12px — скруглённые как в Threads */

    /* Кастомные токены PipelineHQ */
    --ai: 262 83% 58%;                   /* #8B5CF6 — фиолетовый для AI */
    --ai-foreground: 262 83% 97%;        /* #F3EEFF — фон AI-бейджа */
    --success: 152 69% 31%;              /* #18A34A — выполнено */
    --streak: 25 95% 53%;                /* #F97316 — streak / fire */
  }

  .dark {
    --background: 0 0% 7%;               /* #121212 — глубокий матовый чёрный */
    --foreground: 0 0% 93%;              /* #EDEDED — НЕ чистый белый */

    --card: 0 0% 10%;                    /* #1A1A1A — карточки чуть светлее фона */
    --card-foreground: 0 0% 93%;

    --popover: 0 0% 10%;
    --popover-foreground: 0 0% 93%;

    --primary: 0 0% 93%;                 /* #EDEDED */
    --primary-foreground: 0 0% 7%;       /* #121212 */

    --secondary: 0 0% 15%;               /* #262626 */
    --secondary-foreground: 0 0% 93%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 55%;        /* #8C8C8C */

    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 93%;

    --border: 0 0% 18%;                  /* #2E2E2E */
    --input: 0 0% 18%;
    --ring: 0 0% 83%;
  }
}
```

### Базовые стили

```css
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### Опционально: subtle gradient на фоне

Для ещё большей глубины можно добавить лёгкий градиент:

```css
body {
  background: linear-gradient(180deg, #F0F0F0 0%, #F5F5F5 100%);
}
```

---

## Типографика

### Шрифт: Inter

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Шкала размеров

| Роль | Tailwind классы | Результат |
|------|----------------|-----------|
| H1 — Заголовок страницы | `text-2xl font-bold tracking-tight` | 28px, Bold, -0.02em |
| H2 — Секция | `text-xl font-semibold tracking-tight` | 22px, Semibold |
| H3 — Подзаголовок | `text-lg font-semibold` | 18px, Semibold |
| Body | `text-sm font-normal` | 15px, Regular |
| Body Bold | `text-sm font-semibold` | 15px, Semibold |
| Caption | `text-xs text-muted-foreground` | 13px, серый |
| Micro | `text-[11px] font-medium text-muted-foreground` | 11px, метаданные |

> **Примечание:** В Tailwind `text-sm` = 14px по умолчанию. Для точного попадания в 15px настроить `fontSize` в конфиге:
> ```js
> fontSize: { body: ['15px', '1.5'] }
> ```

### Принципы типографики
- **Межстрочный интервал:** 1.4–1.5 для body, 1.2 для заголовков
- **Контраст через вес**, а не через цвет (как в Threads)
- **Никаких CAPS-заголовков** — всё sentence case

---

## Сетка и отступы

### Базовый юнит: `4px`

| Токен | Значение | Tailwind | Использование |
|-------|----------|----------|---------------|
| `space-xs` | 4px | `gap-1` / `p-1` | Минимальный зазор |
| `space-sm` | 8px | `gap-2` / `p-2` | Между элементами внутри группы |
| `space-md` | 16px | `gap-4` / `p-4` | Стандартный отступ |
| `space-lg` | 24px | `gap-6` / `p-6` | Между секциями |
| `space-xl` | 32px | `gap-8` / `p-8` | Большие разделы |
| `space-2xl` | 48px | `gap-12` / `pt-12` | Отступ страницы сверху |

### Контейнер
- **Max-width:** `600px` (узкая лента, как в Threads)
- **Padding:** `16px` по бокам на мобильных
- **Центрирован** на десктопе

```tsx
<div className="mx-auto max-w-[600px] px-4">
  {children}
</div>
```

---

## Компоненты shadcn/ui

### Установка

```bash
npx shadcn@latest add button card input label badge separator
npx shadcn@latest add dialog sheet tabs radio-group checkbox
npx shadcn@latest add progress tooltip dropdown-menu avatar
npx shadcn@latest add form select textarea sonner
```

---

### Button — Кнопки

#### Primary CTA (угольная, на всю ширину)
```tsx
<Button className="w-full h-12 rounded-xl text-[15px] font-semibold">
  Подтвердить стратегию
</Button>
```

#### Secondary (обводка)
```tsx
<Button variant="outline" className="w-full h-12 rounded-xl text-[15px]">
  Пропустить
</Button>
```

#### Ghost / Text link
```tsx
<Button variant="ghost" className="text-muted-foreground">
  Пропустить — заполню вручную
</Button>
```

#### Destructive
```tsx
<Button variant="destructive">Удалить</Button>
```

**Кастомизация:**
- `border-radius: 12px` → `rounded-xl`
- `height: 48px` → `h-12` для основных CTA
- `active:scale-[0.98]` — тактильное нажатие как в Threads
- Primary цвет: угольный `#171717`, hover `#2A2A2A` — мягче чистого чёрного

---

### Card — Карточки

```tsx
<Card className="rounded-2xl border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
  <CardContent className="p-5">
    <div className="flex items-start gap-3">
      <Checkbox className="mt-0.5 rounded-full h-5 w-5" />
      <div className="space-y-1">
        <p className="text-sm font-semibold">📝 Публикация</p>
        <p className="text-xs text-muted-foreground">
          Пост по шаблону "Pain" о проблеме вашей ЦА
        </p>
        <Button variant="ghost" size="sm" className="px-0 text-xs">
          Открыть черновик →
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
```

**Ключевое:** На серо-матовом фоне белые карточки уже выделяются.
Два варианта оформления карточек:
- `border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]` — "парящие" карточки с минимальной тенью (premium)
- `border shadow-none` — с тонким border, без тени (более строго)

Рекомендуется: **вариант с тенью** — создаёт ощущение глубины и дороговизны.

---

### Input — Поля ввода

```tsx
<div className="space-y-2">
  <Label className="text-xs text-muted-foreground">Ниша</Label>
  <Input
    className="h-11 rounded-xl bg-card border-border
               focus-visible:ring-1 focus-visible:ring-foreground
               text-[15px]"
    value="Маркетинг для SaaS"
  />
  <AIBadge />
</div>
```

**Фокус:** `ring-foreground` (чёрный/белый), не синий — как в Threads.

---

### Badge — Бейджи и метки

```tsx
/* AI-метка */
<Badge className="bg-violet-50 text-violet-600 border-0 text-[11px] font-medium">
  🤖 Заполнено автоматически
</Badge>

/* Ручное изменение */
<Badge variant="secondary" className="text-[11px] font-medium">
  ✏️ Изменено вами
</Badge>

/* Streak */
<Badge className="bg-foreground text-background rounded-full px-3 py-1 text-sm font-semibold">
  🔥 7 дней
</Badge>

/* Статусы лидов */
<Badge variant="outline" className="text-[11px]">new</Badge>
<Badge className="bg-green-50 text-green-700 border-0 text-[11px]">won</Badge>
```

---

### Sheet — Bottom Sheet (мобильное)

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost">Опции</Button>
  </SheetTrigger>
  <SheetContent side="bottom" className="rounded-t-2xl">
    <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-muted" />
    <SheetHeader>
      <SheetTitle>Редактировать нишу</SheetTitle>
    </SheetHeader>
    {/* контент */}
  </SheetContent>
</Sheet>
```

---

### RadioGroup — Выбор CTA

```tsx
<RadioGroup defaultValue="call" className="space-y-2">
  <div className="flex items-center space-x-3 rounded-xl border p-4">
    <RadioGroupItem value="dm" />
    <Label>Написать в DM</Label>
  </div>
  <div className="flex items-center space-x-3 rounded-xl border p-4 border-foreground">
    <RadioGroupItem value="call" />
    <Label className="font-semibold">Запись на созвон</Label>
  </div>
  <div className="flex items-center space-x-3 rounded-xl border p-4">
    <RadioGroupItem value="link" />
    <Label>Переход по ссылке</Label>
  </div>
</RadioGroup>
```

---

### Progress — Шаги онбординга

```tsx
<div className="flex items-center justify-center gap-2">
  {[1, 2, 3, 4, 5].map((step) => (
    <React.Fragment key={step}>
      <div className={cn(
        "h-2 w-2 rounded-full",
        step < currentStep && "bg-foreground",
        step === currentStep && "bg-foreground h-2.5 w-2.5",
        step > currentStep && "bg-border"
      )} />
      {step < 5 && (
        <div className={cn(
          "h-0.5 w-6",
          step < currentStep ? "bg-foreground" : "bg-border"
        )} />
      )}
    </React.Fragment>
  ))}
</div>
```

---

### Sonner — Тосты / Уведомления

```tsx
import { toast } from "sonner"

toast.success("Стратегия сохранена")
toast.error("Не удалось подключить Threads")
```

---

## Кастомные компоненты (поверх shadcn)

### AIBadge

```tsx
function AIBadge({ edited = false }: { edited?: boolean }) {
  if (edited) {
    return (
      <span className="text-[11px] font-medium text-muted-foreground">
        ✏️ Изменено вами
      </span>
    )
  }
  return (
    <span className="text-[11px] font-medium text-violet-600">
      🤖 Определено из вашего Threads
    </span>
  )
}
```

### StreakBadge

```tsx
function StreakBadge({ days }: { days: number }) {
  return (
    <Badge className="bg-foreground text-background rounded-full px-3 py-1 gap-1">
      🔥 <span className="font-semibold tabular-nums">{days}</span> дней
    </Badge>
  )
}
```

### TaskCard (Daily Plan)

```tsx
function TaskCard({
  icon, title, description, done, action
}: TaskCardProps) {
  return (
    <Card className={cn(
      "rounded-2xl border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors",
      done && "bg-muted/50"
    )}>
      <CardContent className="flex items-start gap-3 p-5">
        <Checkbox
          checked={done}
          className="mt-0.5 h-5 w-5 rounded-full"
        />
        <div className="flex-1 space-y-1">
          <p className={cn(
            "text-sm font-semibold",
            done && "line-through text-muted-foreground"
          )}>
            {icon} {title}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
          {action && !done && (
            <Button variant="ghost" size="sm" className="h-auto px-0 text-xs">
              {action} →
            </Button>
          )}
        </div>
        {done && <CheckCircle2 className="h-5 w-5 text-green-600" />}
      </CardContent>
    </Card>
  )
}
```

### InlineEditField (Summary-экран)

```tsx
function InlineEditField({ label, value, aiGenerated, onChange }: Props) {
  const [editing, setEditing] = useState(false)
  const [edited, setEdited] = useState(false)

  return (
    <Card className="rounded-2xl border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <CardContent className="p-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">{label}</Label>
          <Button
            variant="ghost" size="icon"
            className="h-6 w-6 text-muted-foreground"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
        {editing ? (
          <Input
            className="h-9 rounded-lg text-[15px]"
            defaultValue={value}
            autoFocus
            onBlur={(e) => {
              setEditing(false)
              if (e.target.value !== value) {
                setEdited(true)
                onChange(e.target.value)
              }
            }}
          />
        ) : (
          <p className="text-[15px] font-medium">{value}</p>
        )}
        <AIBadge edited={edited} />
      </CardContent>
    </Card>
  )
}
```

---

## Микроанимации (Framer Motion)

### Появление карточек каскадом
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1, duration: 0.2 }}
>
  <TaskCard ... />
</motion.div>
```

### Typewriter-эффект для AI-заполнения
```tsx
<motion.span
  initial={{ width: 0 }}
  animate={{ width: "auto" }}
  className="overflow-hidden whitespace-nowrap"
>
  Маркетинг для SaaS
</motion.span>
```

### Нажатие кнопки
```tsx
<motion.div whileTap={{ scale: 0.98 }}>
  <Button>Подтвердить</Button>
</motion.div>
```

### Таблица анимаций

| Элемент | Анимация | Длительность |
|---------|----------|--------------|
| Переход между экранами | Slide left/right | 300ms ease |
| Появление карточек | Fade-in + slide-up | 200ms ease-out |
| Кнопка нажатие | Scale(0.98) | 100ms |
| Чекбокс выполнения | Bounce + fill | 300ms spring |
| Индикатор загрузки | Pulsating dots (три точки) | Loop |
| AI-заполнение | Typewriter-эффект | По символам |
| Streak increment | Number flip + confetti (subtle) | 500ms |

---

## Иконки (Lucide)

shadcn/ui использует Lucide. Ключевые иконки:

| Контекст | Иконка | Import |
|----------|--------|--------|
| Home / Dashboard | `Home` | `lucide-react` |
| Daily Plan | `ListChecks` | `lucide-react` |
| Content / Drafts | `PenLine` | `lucide-react` |
| Analytics | `BarChart3` | `lucide-react` |
| Leads | `Users` | `lucide-react` |
| Профиль | `User` | `lucide-react` |
| Выполнено | `CheckCircle2` | `lucide-react` |
| Редактировать | `Pencil` | `lucide-react` |
| AI / Робот | `Sparkles` | `lucide-react` |
| Threads | `AtSign` | `lucide-react` |
| Streak / Fire | `Flame` | `lucide-react` |
| Ссылка | `ExternalLink` | `lucide-react` |

---

## Wireframes (ASCII)

### Welcome / Login

```
┌──────────────────────────────────┐
│                                  │
│          [Logo]                  │
│                                  │
│        PipelineHQ                │
│                                  │
│   Превращаем Threads             │
│   в систему продаж               │
│                                  │
│                                  │
│  ┌──────────────────────────┐   │
│  │  Войти через Threads →   │   │  ← Primary Button
│  └──────────────────────────┘   │
│                                  │
│       Что это? Узнать →          │  ← Ghost Button
│                                  │
└──────────────────────────────────┘
```

### Анализ контента (Loading State)

```
┌──────────────────────────────────┐
│                                  │
│           ● ● ●                  │  ← пульсирующие точки
│                                  │
│   Анализируем ваш контент        │
│   в Threads...                   │
│                                  │
│   ┌────────────────────┐         │
│   │  🧵 54 поста       │         │  ← появляются по одному
│   │  👤 bio            │         │
│   │  🔗 3 ссылки       │         │
│   └────────────────────┘         │
│                                  │
└──────────────────────────────────┘
```

### Summary-экран (US-001.6)

```
┌──────────────────────────────────┐
│  ← Назад          Шаг 5 из 5    │
│──────────────────────────────────│
│                                  │
│  Ваша стратегия                  │  ← H1
│  Проверьте и скорректируйте      │  ← Caption
│                                  │
│  ┌──────────────────────────┐   │
│  │ Ниша                  ✏️ │   │
│  │ Маркетинг для SaaS       │   │
│  │ 🤖 Из вашего Threads     │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ Оффер                 ✏️ │   │
│  │ Аудит маркетинговой      │   │
│  │ стратегии за 60 минут    │   │
│  │ ✏️ Изменено вами         │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ Средний чек           ✏️ │   │
│  │ $500                     │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ Целевой клиент        ✏️ │   │
│  │ Фаундеры SaaS на        │   │
│  │ ранней стадии            │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ CTA                   ✏️ │   │
│  │ ○ DM  ● Созвон  ○ Ссылка│   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ Подтвердить стратегию →  │   │  ← Primary Button
│  └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

### Daily Growth Plan

```
┌──────────────────────────────────┐
│  PipelineHQ          🔥 7 дней   │
│──────────────────────────────────│
│                                  │
│  Вторник, 17 февраля             │  ← H2
│  Ваш план на сегодня             │  ← Caption
│                                  │
│  ┌──────────────────────────┐   │
│  │ ○  📝 Публикация         │   │
│  │    Пост по шаблону Pain  │   │
│  │    Открыть черновик →    │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ ✓  💬 Engagement         │   │  ← выполнено
│  │    5 комментариев в нише │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │ ○  🎯 Conversion         │   │
│  │    Написать 1 DM тёплому │   │
│  │    лиду                  │   │
│  └──────────────────────────┘   │
│                                  │
│──────────────────────────────────│
│  🏠    📋    ✏️    📊    👤    │  ← Bottom Tab Bar
└──────────────────────────────────┘
```

---

## Layout

### Мобильный (< 768px)

```
┌─────────────────────┐
│  Header (sticky)    │  ← Logo + StreakBadge
├─────────────────────┤
│                     │
│  Content            │  ← max-w-[600px] mx-auto px-4
│  (scrollable)       │
│                     │
├─────────────────────┤
│  Bottom Tab Bar     │  ← fixed bottom-0
└─────────────────────┘
```

### Десктоп (≥ 768px)

```
┌──────┬──────────────────────┐
│      │  Header              │
│ Side │──────────────────────│
│ bar  │                      │
│ 240px│  Content (600px)     │
│      │  centered            │
│      │                      │
└──────┴──────────────────────┘
```

### Layout Component

```tsx
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col border-r">
        <SidebarNav />
      </aside>

      {/* Main content */}
      <main className="md:pl-60">
        <div className="mx-auto max-w-[600px] px-4 pb-20 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomTabBar className="md:hidden" />
    </div>
  )
}
```

### Bottom Tab Bar

```tsx
function BottomTabBar({ className }: { className?: string }) {
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 border-t bg-background", className)}>
      <nav className="mx-auto max-w-[600px] flex justify-around py-2">
        <Button variant="ghost" size="icon" className="text-foreground">
          <Home className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <ListChecks className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <PenLine className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <BarChart3 className="h-5 w-5" />
        </Button>
      </nav>
    </div>
  )
}
```

---

## Responsive

| Breakpoint | Поведение |
|------------|-----------|
| `< 480px` | Mobile-first. Full-width карточки. Bottom tab bar. |
| `480–768px` | Tablet. Контейнер 600px по центру. |
| `> 768px` | Desktop. Sidebar (240px) + контент 600px. |

---

## Принципы дизайна (чеклист)

### Premium Gray Matte
- [ ] **Фон — матовый серый `#F5F5F5`**, НЕ белый
- [ ] **Карточки — белые `#FFFFFF`** на сером фоне, создают глубину
- [ ] **Текст — угольный `#171717`**, НЕ чистый чёрный `#000`
- [ ] **Карточки "парят"** — `border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]`
- [ ] **Минимум цвета** — если можно решить угольным/серым/белым — решаем

### Компоненты
- [ ] **Не более 2 основных действий** на экране
- [ ] **Щедрые отступы** — контент не должен быть "зажат"
- [ ] **Один шрифт (Inter)** — различия через размер и вес
- [ ] **Скругления:** `rounded-xl` (12px) для кнопок/инпутов, `rounded-2xl` (16px) для карточек
- [ ] **Full-width кнопки** на мобильных (`w-full h-12`)
- [ ] **Focus ring угольный** — `ring-foreground`, не синий
- [ ] **Typewriter-эффект** при AI-заполнении — wow-момент
- [ ] **active:scale-[0.98]** на кликабельных элементах
- [ ] **Контейнер** строго `max-w-[600px]`
- [ ] **Sonner** для тостов (встроен в shadcn)
