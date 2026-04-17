import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      conversation,
      lastAnswer,
      lastScore,
      jobPosition,
      questionList,
      questionsAsked,
    } = await req.json();

    if (!conversation || !lastAnswer) {
      return NextResponse.json(
        { error: "Missing conversation or lastAnswer" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // Build a compact conversation summary for the prompt
    const conversationSummary = conversation
      .slice(-10) // Last 10 turns to stay within token budget
      .map((m) => `${m.role === "user" ? "CANDIDATE" : "INTERVIEWER"}: ${m.content}`)
      .join("\n");

    const remainingQuestions = (questionList || [])
      .slice(questionsAsked || 0)
      .slice(0, 5)
      .map((q, i) => `${i + 1}. ${q.question || q}`)
      .join("\n");

    const prompt = `You are an expert adaptive interview coach analysing a live technical interview.

JOB POSITION: ${jobPosition || "Software Engineer"}
CANDIDATE'S LAST ANSWER SCORE: ${lastScore || 5}/10
QUESTIONS ASKED SO FAR: ${questionsAsked || 0}

REMAINING PLANNED QUESTIONS:
${remainingQuestions || "None (free-flowing)"}

RECENT CONVERSATION:
${conversationSummary}

LAST ANSWER:
"${lastAnswer}"

YOUR TASK:
Based on the last answer score (${lastScore}/10) and conversation context, determine:
1. The best follow-up question the interviewer should ask
2. The current difficulty level of the interview
3. Whether the interviewer should move on to a new topic
4. What core topic is being probed

ADAPTIVE DIFFICULTY RULES:
- Score ≥ 9: Set difficulty to "Expert". Ask about extreme edge cases, system design at scale, or highly nuanced trade-offs.
- Score 7-8: Set difficulty to "Hard". Ask for optimisations, time/space complexity, or real-world examples.
- Score 5-6: Set difficulty to "Medium". Ask for a concrete example, clarification, or slightly deeper explanation.
- Score ≤ 4: Set difficulty to "Easy". Simplify, give a hint, or redirect to a related easier concept.

FOLLOW-UP QUESTION PATTERNS (use these as inspiration):
- Missing complexity → "What is the time and space complexity of your solution?"
- Weak on depth → "Can you walk me through a concrete real-world example of this?"  
- Missing edge cases → "What happens when the input is null, empty, or extremely large?"
- Strong answer → "How would you optimise this further for a distributed system?"
- Algorithm topic → "How would this change if the data structure was [modified version]?"
- Concept topic → "What are the main trade-offs of this approach versus [alternative]?"

MOVE ON IF:
- The candidate has answered 3+ follow-up questions on the same topic
- The candidate scored ≥ 9 and fully demonstrated mastery
- The conversation has clearly exhausted this topic

You MUST return ONLY a valid JSON object with NO markdown, code blocks, or extra text:
{
  "followUpQuestion": "The exact follow-up question to ask next",
  "difficultyLevel": "Easy" | "Medium" | "Hard" | "Expert",
  "reasoning": "1-sentence explanation of why you chose this follow-up",
  "shouldMoveOn": true | false,
  "topicProbed": "The core concept being tested (e.g. 'Binary Search', 'React Hooks')"
}`;

    const PRIMARY_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
    const SECONDARY_MODEL = "google/gemma-3-12b-it:free";
    const FALLBACK_MODEL = "openrouter/free";

    const callModel = async (model) => {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });
      return completion.choices[0].message.content;
    };

    const parseJSON = (text) => {
      try {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : null;
      } catch {
        return null;
      }
    };

    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const raw = await callModel(PRIMARY_MODEL);
        const parsed = parseJSON(raw);
        if (parsed) return NextResponse.json(parsed);
      } catch (err) {
        const isRateLimited = err?.status === 429;
        const isLast = attempt === MAX_RETRIES - 1;

        if (isRateLimited && !isLast) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          await new Promise((r) => setTimeout(r, delay));
        } else if (isLast) {
          // Try secondary
          try {
            const raw2 = await callModel(SECONDARY_MODEL);
            const parsed2 = parseJSON(raw2);
            if (parsed2) return NextResponse.json(parsed2);
          } catch (_) {}
          // Try fallback
          try {
            const raw3 = await callModel(FALLBACK_MODEL);
            const parsed3 = parseJSON(raw3);
            if (parsed3) return NextResponse.json(parsed3);
          } catch (_) {}
        } else {
          throw err;
        }
      }
    }

    // Graceful fallback response
    const fallbackDifficulty =
      lastScore >= 9
        ? "Expert"
        : lastScore >= 7
        ? "Hard"
        : lastScore >= 5
        ? "Medium"
        : "Easy";

    return NextResponse.json({
      followUpQuestion:
        lastScore >= 7
          ? "Can you describe any edge cases or limitations of the approach you just described?"
          : "Could you clarify that with a concrete example?",
      difficultyLevel: fallbackDifficulty,
      reasoning: "Generated from score heuristics due to model unavailability.",
      shouldMoveOn: false,
      topicProbed: "General",
    });
  } catch (err) {
    console.error("Adaptive question API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate adaptive question" },
      { status: 500 }
    );
  }
}
