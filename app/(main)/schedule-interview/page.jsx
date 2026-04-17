"use client";
import React, { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/services/supabaseClient";
import InterviewCard from "./../dashboard/_components/InterviewCard";
import { useUser } from "@/app/provider";

function ScheduleInterview() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      GetInterview();
    }
  }, [user?.email]);

  const GetInterview = async () => {
    try {
      setLoading(true);

      // 1. Fetch Interviews created by the user
      // Corrected column names based on QuestionList.jsx: duration instead of interviewDuration, removing createdBy
      const { data: interviewsData, error: interviewsError } = await supabase
        .from("Interviews")
        .select("jobPosition, duration, interview_id, userEmail, id, created_at")
        .eq("userEmail", user?.email)
        .order("id", { ascending: false });

      if (interviewsError) {
        console.error("Supabase error fetching interviews:", interviewsError);
        return;
      }

      if (!interviewsData || interviewsData.length === 0) {
        setInterviewList([]);
        return;
      }

      // 3. Map duration to interviewDuration for UI compatibility (if needed by InterviewCard, though it uses duration directly now)
      const combinedData = interviewsData.map(interview => {
        return {
          ...interview,
          interviewDuration: interview.duration
        };
      });

      setInterviewList(combinedData);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl">
        Interview List with candidate feedback
      </h2>

      {!loading && interviewList.length === 0 && (
        <div className="p-5 flex flex-col items-center gap-3 border bg-blue-50 border-blue-200 rounded-xl mt-5">
          <Video className="h-10 w-10 text-primary" />
          <h2>You don't have any interview created</h2>
          <Link href="/dashboard/create-interview">
            <Button className="cursor-pointer hover:animate-pulse">
              + Create New Interview
            </Button>
          </Link>
        </div>
      )}

      {loading && <div className="mt-5">Loading interviews...</div>}

      {!loading && interviewList.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
          {interviewList.map((interview, index) => (
            <InterviewCard
              Interviews={interview}
              key={index}
              viewDetail={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduleInterview;
