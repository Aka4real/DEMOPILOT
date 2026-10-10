import { getGeminiClient, GEMINI_FLASH_MODEL } from "./client";

export interface NarrationSynthesisResult {
  text: string;
  voice: string;
  charCount: number;
  durationSec: number;
  audioBase64?: string;
}

export async function synthesizeSceneNarration(params: {
  text: string;
  voiceStyle: "professional" | "conversational" | "executive";
  targetDurationSec?: number;
}): Promise<NarrationSynthesisResult> {
  const { text, voiceStyle, targetDurationSec = 8 } = params;
  const client = getGeminiClient();

  const voiceName =
    voiceStyle === "executive"
      ? "Charon (Executive)"
      : voiceStyle === "conversational"
      ? "Aoede (Conversational)"
      : "Puck (Professional Studio)";

  // Words count estimation for spoken English: ~140-150 words per minute => ~2.4 words per second
  const words = text.trim().split(/\s+/).length;
  const estimatedDuration = Math.max(4, Math.round((words / 2.4) * 10) / 10);

  // If Gemini API is available and custom script polishing is needed:
  if (client) {
    try {
      const model = client.getGenerativeModel({
        model: GEMINI_FLASH_MODEL,
        generationConfig: { temperature: 0.2 },
      });

      const prompt = `
Refine this voiceover narration script for a high-end product demonstration.
Ensure it sounds calm, natural, and authoritative, exactly matching a ${targetDurationSec}-second scene.
DO NOT use hype words, exclamation marks, or unsupported marketing claims.

RAW TEXT: "${text}"

Return ONLY the refined narration text.
`;

      const result = await model.generateContent(prompt);
      const refinedText = result.response.text().trim();

      return {
        text: refinedText || text,
        voice: voiceName,
        charCount: (refinedText || text).length,
        durationSec: estimatedDuration,
      };
    } catch (err) {
      console.warn("TTS refinement note:", err);
    }
  }

  return {
    text,
    voice: voiceName,
    charCount: text.length,
    durationSec: estimatedDuration,
  };
}
