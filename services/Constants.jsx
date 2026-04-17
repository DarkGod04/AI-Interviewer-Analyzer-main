// import { LayoutDashboard,
//     Settings,
//     WalletCards,
//     List,
//     Calender
//  } from "lucide-react"

import { LayoutDashboard, Settings, WalletCards, List, Component, Calendar, Puzzle, User2Icon, Code2Icon, BriefcaseBusinessIcon, Activity } from 'lucide-react';


export const SideBarOptions = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        name: "My Performance",
        icon: Activity,
        path: "/performance",
    },
    {
        name: "Schedule Interview",
        icon: Calendar,
        path: "/schedule-interview",
    },
    {
        name: "All Interview",
        icon: List,
        path: "/all-interview",
    },
    {
        name: "Billing",
        icon: WalletCards,
        path: "/billings",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/settings",
    },
]

export const InterviewType = [
    {
        title: "Technical",
        icon: Code2Icon
    },
    {
        title: "Behavioral",
        icon: User2Icon
    },
    {
        title: "Experience",
        icon: BriefcaseBusinessIcon
    },
    {
        title: "Problem Solving",
        icon: Puzzle
    },
    {
        title: "Leadership",
        icon: Component
    },

]





export const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}
Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depending on interview duration.
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.
Format your response as a valid JSON object with a single key "interviewQuestions" containing the array of questions. Do not include any markdown formatting, code blocks, or extra text.
Example format:
{
  "interviewQuestions": [
    {
      "question": "Question text here",
      "type": "Technical/Behavioral/Experience/Problem Solving/Leadership"
    },
    {
      ...
    }
  ]
}

The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`;


export const FEEDBACK_PROMPT = `
You are an expert technical interviewer and recruiter. 
Your task is to evaluate a candidate based on an interview transcript. 

Job Position: {{jobPosition}}
Job Description: {{jobDescription}}
Interview Type: {{interviewType}}

Interview Conversation:
{{conversation}}

Based on the interview conversation and the job requirements above:
1. Provide a rating out of 10 for: Technical Skills, Communication, Problem Solving, and Experience.
2. Analyze the candidate's tone (e.g., Aggressive, Calm, Nervous, Confident) and provide a rating out of 10 for how professional it was.
3. Provide a 3-line summary of the interview performance.
4. Provide a final recommendation (Yes/No) and a brief message explaining why.
5. Identify 2-3 key strengths demonstrated by the candidate.
6. Identify 1-2 weaknesses or areas for improvement.
7. Provide an actionable "growth checklist" (2-3 suggested improvements).

# FORMAT REQUIREMENT
You MUST return your response STRICTLY as a valid JSON object matching the exact schema below. Do not include markdown code blocks (e.g. \`\`\`json) or any conversational text.

{
   "feedback": {
      "rating": {
         "technicalSkills": 8,
         "communication": 7,
         "problemSolving": 6,
         "experience": 8,
         "tone": 9
      },
      "toneAnalysis": "Confident and professional.",
      "summary": "The candidate has a solid understanding of frontend development.\\nThey communicated clearly but struggled slightly with algorithms.\\nOverall, they are a strong fit.",
      "Recommendation": "Yes",
      "RecommendationMsg": "Strong technical foundation and good communication.",
      "strengths": [
         "Deep knowledge of React.",
         "Clear communication."
      ],
      "weaknesses": [
         "Hesitant when discussing backend architecture."
      ],
      "improvements": [
         "Review system design principles."
      ]
   }
}`;

