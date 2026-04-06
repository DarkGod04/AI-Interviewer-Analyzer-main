import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { conversation } = await req.json();

  if (!conversation || !Array.isArray(conversation)) {
    return NextResponse.json(
      { error: "Invalid conversation data" },
      { status: 400 }
    );
  }

  const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
    "{{conversation}}",
    JSON.stringify(conversation)
  );

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemma-3-27b-it:free",
        messages: [{ role: "user", content: FINAL_PROMPT }],
      });
      return NextResponse.json(completion.choices[0].message);
    } catch (err) {
      const isRateLimited = err?.status === 429;
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (isRateLimited && !isLastAttempt) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(
          `429 rate limit on feedback. Retrying in ${(delay / 1000).toFixed(1)}s... (attempt ${attempt + 1}/${MAX_RETRIES})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("Error in ai-feedback API:", err);
        return NextResponse.json(
          { error: err.message || "Failed to generate feedback" },
          { status: err?.status || 500 }
        );
      }
    }
  }
}
