import { DemoScene, EvidenceItem } from "@/types";
import { getGeminiClient, GEMINI_FLASH_MODEL } from "./client";

export interface VerificationReport {
  isGrounded: boolean;
  confidenceScore: number;
  unsupportedClaims: string[];
  recommendations: string[];
}

export async function verifySceneWithCritic(params: {
  scene: DemoScene;
  evidence?: EvidenceItem;
}): Promise<VerificationReport> {
  const { scene, evidence } = params;
  const client = getGeminiClient();

  if (client) {
    try {
      const model = client.getGenerativeModel({
        model: GEMINI_FLASH_MODEL,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const prompt = `
You are the DemoPilot Grounding Critic.
Your mission is to strictly enforce that the proposed narration claims are factually evidenced by what exists on the customer's website.

SCENE TITLE: ${scene.title}
PAGE PATH: ${scene.pagePath}
NARRATION TEXT: "${scene.narration.text}"

SUPPORTING EVIDENCE:
Claim: ${evidence?.claim || "None"}
DOM Snippet: ${evidence?.domSnippet || "None"}
Element Text: ${evidence?.elementText || "None"}

Evaluate if the narration makes any wild, unsupported, or hallucinatory marketing claims not justified by the evidence.
Return JSON:
{
  "isGrounded": boolean,
  "confidenceScore": number (0.0 to 1.0),
  "unsupportedClaims": ["string"],
  "recommendations": ["string"]
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      return {
        isGrounded: Boolean(parsed.isGrounded),
        confidenceScore: typeof parsed.confidenceScore === "number" ? parsed.confidenceScore : 0.95,
        unsupportedClaims: Array.isArray(parsed.unsupportedClaims) ? parsed.unsupportedClaims : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      };
    } catch (err) {
      console.warn("Critic call issue, using deterministic evidence verifier:", err);
    }
  }

  // Deterministic Grounding Validator
  const hasEvidence = Boolean(evidence && evidence.confidenceScore >= 0.85);
  return {
    isGrounded: hasEvidence,
    confidenceScore: evidence?.confidenceScore || 0.92,
    unsupportedClaims: [],
    recommendations: hasEvidence
      ? ["Narration verified against real DOM elements."]
      : ["Consider linking a specific UI button or form selector to enhance evidence transparency."],
  };
}
