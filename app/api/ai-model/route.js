import OpenAI from "openai";
import { NextResponse } from "next/server";
import { QUESTIONS_PROMPT } from "@/services/Constants";

export async function POST(req) {
  const { jobPosition, jobDescription, duration, type, resume } = await req.json();
  const FINAL_PROMPT = QUESTIONS_PROMPT.replace("{{jobTitle}}", jobPosition)
    .replace("{{jobDescription}}", jobDescription)
    .replace("{{duration}}", duration)
    .replace("{{type}}", type)
    .replace("{{resume}}", resume || "Not provided");

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const MAX_RETRIES = 3;
  const FALLBACK_MODEL = "openrouter/free";
  const PRIMARY_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
  const SECONDARY_MODEL = "google/gemma-3-12b-it:free";

  const retryWithFallback = async (modelToUse) => {
    try {
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [{ role: "user", content: FINAL_PROMPT }],
      });
      return NextResponse.json(completion.choices[0].message);
    } catch (err) {
      throw err;
    }
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await retryWithFallback(PRIMARY_MODEL);
    } catch (err) {
      const isRateLimited = err?.status === 429;
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (isRateLimited && !isLastAttempt) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(`429 rate limit hit. Retrying in ${(delay / 1000).toFixed(1)}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else if (isLastAttempt) {
        console.warn("⚠️ Primary model exhausted. Trying secondary model...");
        try {
          return await retryWithFallback(SECONDARY_MODEL);
        } catch (secondaryErr) {
          console.warn("⚠️ Secondary model failed. Trying final fallback...");
          try {
            return await retryWithFallback(FALLBACK_MODEL);
          } catch (fallbackErr) {
            console.error("❌ All models failed:", fallbackErr);
            return NextResponse.json(
              { error: "Model rate limited. Please try again in 1 minute." },
              { status: 429 }
            );
          }
        }
      } else {
        console.error("Error in AI model API:", err);
        return NextResponse.json({ error: err.message }, { status: err?.status || 500 });
      }
    }
  }
}
