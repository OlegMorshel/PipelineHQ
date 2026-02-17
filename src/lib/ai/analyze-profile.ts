import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { PROMPTS } from "./prompts";

/**
 * Zod-схема для результата анализа профиля
 */
export const profileAnalysisSchema = z.object({
  niche: z.string().describe("Ниша пользователя"),
  offer: z.string().describe("Оффер/услуга пользователя"),
  averageCheck: z.number().describe("Предполагаемый средний чек в долларах"),
  targetClient: z.string().describe("Целевой клиент"),
  cta: z
    .enum(["dm", "call", "link"])
    .describe("Рекомендуемый CTA"),
});

export type ProfileAnalysis = z.infer<typeof profileAnalysisSchema>;

/**
 * Анализирует контент из Threads и возвращает стратегию
 */
export async function analyzeProfile(posts: string[], bio?: string) {
  const content = [
    bio ? `Bio: ${bio}` : "",
    `Последние посты:\n${posts.map((p, i) => `${i + 1}. ${p}`).join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: profileAnalysisSchema,
    prompt: `${PROMPTS.analyzeProfile}\n\n${content}`,
  });

  return result.object;
}
