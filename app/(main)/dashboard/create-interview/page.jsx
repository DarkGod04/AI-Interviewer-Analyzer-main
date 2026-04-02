
"use client";
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";
import InterviewLink from "./_components/InterviewLink";
import { useUser } from "@/app/provider";

function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1); /// remove this
  const [formData, setFormData] = useState({});
  const [interviewId, setInterviewId] = useState();
  const { user } = useUser();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    // Increment step by 1 each time formData changes
    console.log(formData); // Now the updated formData will be logged here after every change.
  }, [formData]); // Will log every time formData changes

  const onGoToNext = () => {
    if (user?.credits <= 0) {
      toast(" 0 credit left");
      return;
    }

    if (
      !formData?.jobPosition ||
      !formData?.jobDescription ||
      !formData.duration ||
      !formData?.types
    ) {
      return toast("❌ Please enter alldetails");
    }
    setStep(step + 1);
    return toast("🚀 Lets go to next");
  };

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
  };

  return (
    <div className="mt-8 px-6 md:px-16 lg:px-32 xl:px-48 pb-20">
      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h2 className="font-extrabold text-3xl tracking-tight text-slate-800 dark:text-white">
            Create New{" "}
            <span className="italic font-caramel text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 font-medium px-1">
              Interview
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Configure your AI candidate evaluation</p>
        </div>
      </div>
      
      <div className="mb-10">
        <Progress value={step * 33.33} className="h-2 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-gradient-to-r from-primary to-violet-500" />
      </div>
      {step == 1 ? (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={() => onGoToNext()}
        />
      ) : step == 2 ? (
        <QuestionList
          formData={formData}
          onCreateLink={(interview_id) => onCreateLink(interview_id)}
        />
      ) : step == 3 ? (
        <InterviewLink interview_id={interviewId} formData={formData} />
      ) : null}
    </div>
  );
}

export default Page;
