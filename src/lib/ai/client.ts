import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;
if (apiKey && apiKey !== "") {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.warn("Failed to initialize GoogleGenerativeAI with provided key:", error);
  }
}

export function getGeminiClient(): GoogleGenerativeAI | null {
  return genAI;
}

export const GEMINI_PRO_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-pro";
export const GEMINI_FLASH_MODEL = process.env.GEMINI_FLASH_MODEL || "gemini-1.5-flash";
