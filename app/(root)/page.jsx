import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id),
    getLatestInterviews({ userId: user?.id }),
  ]);

  console.log("UI", userInterviews)
  console.log("Latest", latestInterviews)

  console.log(user.id)

  const medical_chats = latestInterviews && latestInterviews.length > 0;

  return (
    <>

      {/* Header */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Your AI Health Assistant</h2>
          <h3>Trusted Medical Information, 24/7</h3>
          <p className="text-lg">
            Get instant answers to your health questions,
            symptom checks & general wellness tips          </p>

          <button
            
            className="btn-primary max-sm:w-full border border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.6)]"
          >
            <Link href="/interview">Start Chatting</Link>
          </button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-image"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>



      {/* All Past Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Latest Medical Chats</h2>

        <div className="interviews-section">
          {medical_chats ? (
            latestInterviews.map((chat) => (
              <InterviewCard
                key={chat.id}
                chatId={chat.id}
                userId={user?.id}
                chiefComplaint={chat.chiefComplaint}
                possibleConditions={chat.possibleConditions}
                recommendations={chat.recommendations}
                severityLevel={chat.severityLevel}
                summary={chat.summary}
                createdAt={chat.createdAt}
              />
            ))
          ) : (
            <p>There are no medical chats available</p>
          )}
        </div>
      </section>

    </>
  );
};

export default Page;