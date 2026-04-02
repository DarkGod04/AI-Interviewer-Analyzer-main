import OpenAI from "openai";
import { NextResponse } from "next/server";
import { QUESTIONS_PROMPT } from "@/services/Constants";

export async function POST(req) {
  const { jobPosition, jobDescription, duration, type } = await req.json();
  const FINAL_PROMPT = QUESTIONS_PROMPT.replace("{{jobTitle}}", jobPosition)
    .replace("{{jobDescription}}", jobDescription)
    .replace("{{duration}}", duration)
    .replace("{{type}}", type);

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash:free",
        messages: [{ role: "user", content: FINAL_PROMPT }],
      });
      return NextResponse.json(completion.choices[0].message);
    } catch (err) {
      const isRateLimited = err?.status === 429;
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (isRateLimited && !isLastAttempt) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(
          `429 rate limit hit. Retrying in ${(delay / 1000).toFixed(1)}s... (attempt ${attempt + 1}/${MAX_RETRIES})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("Error in AI model API:", err);
        return NextResponse.json(
          { error: err.message },
          { status: err?.status || 500 }
        );
      }
    }
  }
}
