"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionListContainer from "./QuestionListContainer";
import { supabase } from "./../../../../../services/supabaseClient";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  // Auto-finish once questions are ready to go straight to the interview
  useEffect(() => {
    if (questions.length > 0 && !saveLoading) {
      onFinish();
    }
  }, [questions]);

  const GenerateQuestionList = async () => {
    if (loading || questions.length > 0) return;
    
    console.log("Sending data to server:", formData);
    setLoading(true);

    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });
      console.log("Generated Questions:", result.data);
      const Content = result.data.content;

      // Extract JSON block using regex to find the first valid JSON object
      const jsonMatch = Content.match(/\{[\s\S]*\}/);
      let fixedContent = jsonMatch ? jsonMatch[0] : Content;

      // Clean up markdown code blocks if still present (fallback)
      fixedContent = fixedContent.replace(/```json/g, "").replace(/```/g, "").trim();

      let parsedQuestions = [];
      try {
        const parsed = JSON.parse(fixedContent);
        parsedQuestions = parsed.interviewQuestions || [];
        setQuestions(parsedQuestions);
        console.log("Parsed interviewQuestions:", parsedQuestions);
      } catch (parseError) {
        toast("Error parsing questions from server response.");
        console.error("Parsing error:", parseError, "Content:", fixedContent);
        setQuestions([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error generating questions:", error);
      toast("Error generating questions: " + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  const onFinish = async () => {
    console.log("onFinish called. User:", user);
    setSaveLoading(true);
    const interview_id = uuidv4();
    if (!user) {
      toast("Please login to create an interview");
      setSaveLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("Interviews")
      .insert([
        {
          jobPosition: formData.jobPosition,
          jobDescription: formData.jobDescription,
          duration: formData.duration,
          type: formData.types ? JSON.stringify(formData.types) : null, // Map types to type
          questionList: questions,
          userEmail: user?.email,
          interview_id: interview_id,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving interview:", error);
      toast("Error creating interview: " + error.message);
      setSaveLoading(false);
      return;
    }

    //update user
    const userUpdate = await supabase
      .from("Users")
      .update({ credits: Number(user?.credits - 1) })
      .eq("email", user?.email)
      .select();

    console.log("userUpdate", userUpdate);

    setSaveLoading(false);
    console.log("okii", data);
    onCreateLink(interview_id);
  };

  return (
    <>
      {loading && (
        <div className="glass-card p-8 rounded-3xl border-primary/20 flex flex-col items-center justify-center gap-6 mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-violet-500/5 animate-pulse pointer-events-none"></div>
          <Loader2Icon className="w-12 h-12 text-primary animate-spin" />
          <div className="text-center relative z-10">
            <h2 className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white mb-2">
              Generating Interview <span className="text-primary font-caramel text-3xl font-medium px-1">Questions</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Our AI is analyzing the requirements and crafting a personalized technical interview suite...
            </p>
          </div>
        </div>
      )}

      {!loading && questions?.length > 0 && (
        <div className="glass-card p-12 rounded-3xl border-emerald-500/20 flex flex-col items-center justify-center gap-6 mt-8 relative overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-primary/5 animate-pulse pointer-events-none"></div>
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-emerald-200">
             <PlusIcon className="w-8 h-8 text-emerald-600 animate-bounce" />
          </div>
          <div className="text-center relative z-10">
            <h2 className="font-extrabold text-2xl tracking-tight text-slate-800 mb-2">
              Interview <span className="text-emerald-500 font-caramel text-3xl font-medium px-1">Finalized!</span>
            </h2>
            <p className="text-slate-500 font-medium">
              We've crafted your custom questions. Taking you to the live session now...
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default QuestionList;
