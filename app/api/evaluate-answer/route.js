import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { question, answer, jobPosition, conversationHistory } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: "Missing question or answer" }, { status: 400 });
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // Build context from recent conversation history if provided
    const recentHistory = conversationHistory
      ? conversationHistory
          .slice(-6)
          .map((m) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
          .join("\n")
      : "";

    const prompt = `You are an expert technical interviewer evaluating a live candidate response for the position of "${jobPosition || "Software Engineer"}".

${recentHistory ? `RECENT CONVERSATION CONTEXT:\n${recentHistory}\n` : ""}

QUESTION ASKED: ${question}
CANDIDATE'S ANSWER: ${answer}

EVALUATION CRITERIA:
- Technical Depth: Does the answer demonstrate genuine understanding?
- Clarity: Is the explanation clear and structured?
- Relevance: Does it directly address the question?
- Completeness: Are edge cases, complexity, trade-offs mentioned?

DIFFICULTY CALIBRATION:
- Score ≥ 9  → difficultyLevel: "Expert"  — escalate to edge cases / system design at scale
- Score 7–8  → difficultyLevel: "Hard"    — probe time/space complexity or optimisations
- Score 5–6  → difficultyLevel: "Medium"  — ask for a concrete example or deeper explanation
- Score ≤ 4  → difficultyLevel: "Easy"    — simplify, redirect, or provide a guiding hint

FOLLOW-UP QUESTION LOGIC:
Generate ONE sharp follow-up question based on weaknesses in the answer:
- Weak on complexity → "What is the time and space complexity of your solution?"
- Missing edge cases → "What happens when the input is null, empty, or at extreme scale?"
- Too abstract → "Can you walk through a concrete code example?"
- Strong answer → Escalate: "How would you design this for a distributed system at 10M users/day?"
- Algorithm answer → Probe variation: "How would this approach change if [modified constraint]?"

You MUST return ONLY a valid JSON object with NO markdown, code blocks, or extra text:
{
  "score": (1-10),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvements": ["string"],
  "feedback": "A brief 1–2 sentence summary",
  "difficultyLevel": "Easy" | "Medium" | "Hard" | "Expert",
  "suggestedFollowUp": "The exact follow-up question Jennifer should ask next",
  "topicProbed": "Core concept being tested (e.g. 'Binary Search', 'React Hooks')"
}

EXAMPLES:
Strong answer: {"score": 9, "strengths": ["Deep algorithmic knowledge", "Mentioned O(log n) complexity"], "weaknesses": [], "improvements": ["Discuss rotated array variant"], "feedback": "Excellent technical depth with correct complexity analysis.", "difficultyLevel": "Expert", "suggestedFollowUp": "How would you modify binary search for a rotated sorted array?", "topicProbed": "Binary Search"}
Weak answer: {"score": 4, "strengths": ["Basic concept understood"], "weaknesses": ["No complexity analysis", "Missing edge cases"], "improvements": ["Explain O(log n) reason", "Handle empty array case"], "feedback": "Needs more technical rigour.", "difficultyLevel": "Easy", "suggestedFollowUp": "Can you explain what time complexity means in this context?", "topicProbed": "Algorithm Complexity"}

Only return the JSON object.`;

    const MAX_RETRIES = 3;
    const PRIMARY_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
    const SECONDARY_MODEL = "google/gemma-3-12b-it:free";
    const FALLBACK_MODEL = "openrouter/free";

    const fetchEvaluation = async (modelToUse, customPrompt = null) => {
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [{ role: "user", content: customPrompt || prompt }],
      });
      return completion.choices[0].message.content;
    };

    const parseResponse = (text) => {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return JSON.parse(text);
      } catch (e) {
        return null;
      }
    };

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        let rawContent = await fetchEvaluation(PRIMARY_MODEL);
        let parsed = parseResponse(rawContent);

        if (!parsed) {
          console.warn("⚠️ Evaluation parsing failed, retrying with cleaner instruction...");
          rawContent = await fetchEvaluation(
            PRIMARY_MODEL,
            "Return ONLY the JSON. Keys: score, strengths, weaknesses, improvements, feedback, difficultyLevel, suggestedFollowUp, topicProbed."
          );
          parsed = parseResponse(rawContent);
        }

        if (parsed) return NextResponse.json(parsed);

      } catch (err) {
        const isRateLimited = err?.status === 429;
        const isLastAttempt = attempt === MAX_RETRIES - 1;

        if (isRateLimited && !isLastAttempt) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.warn(`Evaluation rate limit hit. Retrying in ${(delay / 1000).toFixed(1)}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else if (isLastAttempt) {
          console.warn("⚠️ Evaluation primary model exhausted. Trying secondary...");
          try {
            const secondaryRaw = await fetchEvaluation(SECONDARY_MODEL);
            const parsed = parseResponse(secondaryRaw);
            if (parsed) return NextResponse.json(parsed);
          } catch (secondaryErr) {
            console.warn("⚠️ Secondary failed. Trying final fallback...");
          }
          try {
            const fallbackRaw = await fetchEvaluation(FALLBACK_MODEL);
            const parsed = parseResponse(fallbackRaw);
            if (parsed) return NextResponse.json(parsed);
          } catch (fallbackErr) {
            console.error("❌ Evaluation all models failed:", fallbackErr);
            break;
          }
        } else if (!isRateLimited) {
          throw err;
        }
      }
    }

    // Final Graceful Fallback (Prevents 500 Errors)
    return NextResponse.json({
      score: 5,
      strengths: ["Answer submitted successfully"],
      weaknesses: ["Analysis currently processing"],
      improvements: ["Check final report"],
      feedback: "Answer recorded. Detailed analysis will appear in your final report.",
      difficultyLevel: "Medium",
      suggestedFollowUp: "Can you elaborate on that with a practical example?",
      topicProbed: "General",
    });

  } catch (err) {
    console.error("Real-time evaluation error:", err);
    return NextResponse.json(
      {
        score: 5,
        feedback: "Evaluation temporarily unavailable due to high traffic.",
        difficultyLevel: "Medium",
        suggestedFollowUp: "Could you clarify your approach?",
        topicProbed: "General",
      },
      { status: 200 }
    ); // Return 200 to avoid UI crashes
  }
}
