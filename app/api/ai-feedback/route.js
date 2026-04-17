import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { conversation, jobPosition, jobDescription, interviewType } = await req.json();

    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json(
        { error: "Invalid conversation data" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT
      .replace("{{conversation}}", JSON.stringify(conversation))
      .replace("{{jobPosition}}", jobPosition || "N/A")
      .replace("{{jobDescription}}", jobDescription || "N/A")
      .replace("{{interviewType}}", interviewType || "N/A");

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const PRIMARY_MODEL = "google/gemma-4-31b-it:free";
    const FALLBACK_MODEL = "openrouter/free";

    const generateResult = async (modelToUse) => {
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [{ role: "user", content: FINAL_PROMPT }],
      });
      return completion.choices[0].message.content;
    };

    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const rawContent = await generateResult(PRIMARY_MODEL);
        
        // Clean and parse
        let cleanJson = rawContent;
        if (rawContent.includes("```")) {
          cleanJson = rawContent.match(/\{[\s\S]*\}/)?.[0] || rawContent;
        }

        try {
          const parsed = JSON.parse(cleanJson);
          return NextResponse.json({ feedback: parsed.feedback || parsed, raw: rawContent });
        } catch (parseErr) {
          console.error("Failed to parse AI response as JSON:", rawContent);
          return NextResponse.json({ content: rawContent, warning: "Response was not valid JSON" });
        }

      } catch (err) {
        const isRateLimited = err?.status === 429;
        const isLastAttempt = attempt === MAX_RETRIES - 1;

        if (isRateLimited && !isLastAttempt) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.warn(`429 rate limit on feedback. Retrying in ${(delay / 1000).toFixed(1)}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else if (isLastAttempt) {
          console.warn("⚠️ Feedback primary model exhausted. Trying fallback...");
          try {
            const fallbackContent = await generateResult(FALLBACK_MODEL);
            let cleanJson = fallbackContent.match(/\{[\s\S]*\}/)?.[0] || fallbackContent;
            const parsed = JSON.parse(cleanJson);
            return NextResponse.json({ feedback: parsed.feedback || parsed });
          } catch (fallbackErr) {
            console.error("❌ Feedback fallback failed:", fallbackErr);
            throw fallbackErr;
          }
        } else {
          throw err;
        }
      }
    }
  } catch (err) {
    console.error("Error in ai-feedback API:", err?.message, err?.status, JSON.stringify(err?.error));
    return NextResponse.json(
      { error: err.message || "Failed to generate feedback", details: err?.error || null },
      { status: err?.status || 500 }
    );
  }
}

