import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { PROMPTS } from "./prompts";

export type DraftAngle = "pain" | "case" | "belief" | "objection";

/**
 * Генерирует черновик поста по указанному углу
 */
export async function generateDraft({
  angle,
  niche,
  offer,
  targetClient,
}: {
  angle: DraftAngle;
  niche: string;
  offer: string;
  targetClient: string;
}) {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: PROMPTS.generateDraft(angle, niche, offer, targetClient),
  });

  return result.text;
}
