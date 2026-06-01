import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const InterviewCard = ({
  chatId,
  userId,
  chiefComplaint,
  possibleConditions = [],
  recommendations = [],
  severityLevel,
  summary,
  createdAt,
}) => {
  const formattedDate = dayjs(
    createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <h3 className="mt-5 capitalize">
            {chiefComplaint}
          </h3>

          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>
          </div>

          <div className="mt-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                severityLevel === "mild"
                  ? "bg-green-500/20 text-green-400"
                  : severityLevel === "moderate"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {severityLevel}
            </span>
          </div>

          <p className="line-clamp-3 mt-5">
            {summary}
          </p>

          {possibleConditions.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-sm mb-2">
                Possible Conditions
              </p>

              <div className="flex flex-wrap gap-2">
                {possibleConditions.slice(0, 2).map(
                  (condition, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300"
                    >
                      {condition}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-400">
            {recommendations.length} recommendations
          </p>
 
          <Button className="btn-primary">
            <Link href={`/interview/${chatId}/feedback`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;