import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { getUniqueInterviewById } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";

const feedback = async ({ params }) => {
  const { id } = await params;

  const chat = await getUniqueInterviewById(id);

  if (!chat) redirect("/");

  return (
    <section className="section-feedback">

      {/* Header */}
      <div className="flex justify-center">
        <h1 className="text-4xl font-semibold text-center">
          Medical Consultation Summary
        </h1>
      </div>

      {/* Meta */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-6 flex-wrap">

          <div className="flex items-center gap-2">
            <Image
              src="/calendar.svg"
              width={22}
              height={22}
              alt="calendar"
            />
            <p>
              {dayjs(chat.createdAt).format(
                "MMM D, YYYY h:mm A"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">
              Severity:
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                chat.severityLevel === "mild"
                  ? "bg-green-500/20 text-green-400"
                  : chat.severityLevel === "moderate"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {chat.severityLevel}
            </span>
          </div>

        </div>
      </div>

      <hr className="my-6" />

      {/* Chief Complaint */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Chief Complaint
        </h2>

        <p>{chat.chiefComplaint}</p>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Summary
        </h2>

        <p>{chat.summary}</p>
      </div>

      {/* Symptoms */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Symptoms
        </h2>

        <ul className="list-disc pl-5">
          {chat.symptoms?.map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
        </ul>
      </div>

      {/* Possible Conditions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Possible Conditions
        </h2>

        <ul className="list-disc pl-5">
          {chat.possibleConditions?.map(
            (condition, index) => (
              <li key={index}>{condition}</li>
            )
          )}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Recommendations
        </h2>

        <ul className="list-disc pl-5">
          {chat.recommendations?.map(
            (recommendation, index) => (
              <li key={index}>{recommendation}</li>
            )
          )}
        </ul>
      </div>

      {/* Transcript */ }
      {/* 
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Conversation Transcript
        </h2>

        <div className="flex flex-col gap-3">
          {chat.transcript?.map((message, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg"
            >
              <p className="font-semibold capitalize">
                {message.role}
              </p>

              <p>{message.content}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Actions */}
      <div className="flex gap-4 mt-10">
        <button className="btn-secondary flex-1">
          <Link
            href="/"
            className="w-full text-center"
          >
            Back to Dashboard
          </Link>
        </button>

        <button className="btn-primary flex-1">
          <Link
            href="/interview"
            className="w-full text-center"
          >
            Start New Consultation
          </Link>
        </button>
      </div>

    </section>
  );
};

export default feedback;