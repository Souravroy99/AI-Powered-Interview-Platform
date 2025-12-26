import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getUniqueInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getUniqueInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id,
  });

  if (!feedback) redirect("/");

  /**
   * ✅ Convert categoryScores object → array
   */
  const categoryScoresArray = feedback.categoryScores
    ? Object.entries(feedback.categoryScores).map(([name, score]) => ({
        name,
        score,
      }))
    : [];

  return (
    <section className="section-feedback">

      {/* HEADER */}
      <div className="flex justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview –{" "}
          <span className="capitalize">{interview.role}</span>
        </h1>
      </div>

      {/* META */}
      <div className="flex justify-center mt-4">
        <div className="flex gap-6">

          <div className="flex items-center gap-2">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Score:{" "}
              <span className="text-primary-200 font-bold">
                {feedback.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
            </p>
          </div>

        </div>
      </div>

      <hr className="my-6" />

      {/* FINAL ASSESSMENT */}
      <p className="mb-6">{feedback.finalAssessment}</p>

      {/* BREAKDOWN */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Breakdown of the Interview</h2>

        {categoryScoresArray.map((category, index) => (
          <div key={index} className="p-4 border rounded-md">
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
          </div>
        ))}
      </div>

      {/* STRENGTHS */}
      <div className="flex flex-col gap-3 mt-6">
        <h3 className="text-lg font-semibold">Strengths</h3>
        <ul className="list-disc pl-5">
          {feedback.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      {/* IMPROVEMENTS */}
      <div className="flex flex-col gap-3 mt-6">
        <h3 className="text-lg font-semibold">Areas for Improvement</h3>
        <ul className="list-disc pl-5">
          {feedback.areasForImprovement.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mt-10">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="w-full text-center">
            Back to Dashboard
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link href={`/interview/${id}`} className="w-full text-center">
            Retake Interview
          </Link>
        </Button>
      </div>

    </section>
  );
};

export default Feedback;
