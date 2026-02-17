import { z } from "zod";

// ============================================================================
// Onboarding
// ============================================================================

export const onboardingSchema = z.object({
  niche: z.string().min(1, "Укажите нишу"),
  offer: z.string().min(1, "Укажите оффер"),
  averageCheck: z.coerce.number().positive("Укажите средний чек"),
  targetClient: z.string().min(1, "Укажите целевого клиента"),
  cta: z.enum(["dm", "call", "link", "custom"]),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

// ============================================================================
// Leads
// ============================================================================

export const leadStatusEnum = z.enum([
  "new",
  "talking",
  "call",
  "won",
  "lost",
]);

export type LeadStatus = z.infer<typeof leadStatusEnum>;

export const createLeadSchema = z.object({
  name: z.string().min(1, "Укажите имя"),
  source: z.string().optional(),
  postId: z.string().optional(),
  status: leadStatusEnum.default("new"),
  notes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  id: z.string().uuid(),
});

// ============================================================================
// Drafts
// ============================================================================

export const draftAngleEnum = z.enum([
  "pain",
  "case",
  "belief",
  "objection",
]);

export type DraftAngle = z.infer<typeof draftAngleEnum>;

export const draftStatusEnum = z.enum(["draft", "ready", "published"]);

export type DraftStatus = z.infer<typeof draftStatusEnum>;

export const createDraftSchema = z.object({
  angle: draftAngleEnum,
  title: z.string().optional(),
  content: z.string().min(1, "Контент не может быть пустым"),
});

export const updateDraftSchema = z.object({
  id: z.string().uuid(),
  title: z.string().optional(),
  content: z.string().optional(),
  status: draftStatusEnum.optional(),
});

// ============================================================================
// Tasks
// ============================================================================

export const taskTypeEnum = z.enum([
  "publication",
  "engagement",
  "conversion",
]);

export type TaskType = z.infer<typeof taskTypeEnum>;
