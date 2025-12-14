"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { generateObject } from "ai";

export async function getInterviewsByUserId(userId) {
  if (!userId) {
    console.warn("getInterviewsByUserId: userId is undefined or null");
    return [];
  }

  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error in getInterviewsByUserId:", error);
    return [];
  }
}

export async function getLatestInterviews(params = {}) {
  const { userId, limit = 20 } = params || {};

  // If no userId provided, just return latest finalized interviews (not filtering by user)
  // This avoids passing undefined into a Firestore query.
  try {
    const baseQuery = db.collection("interviews").where("finalized", "==", true);

    let query;
    if (userId) {
      // Firestore requires ordering by the same field used in a != filter.
      query = baseQuery
        .where("userId", "!=", userId)
        .orderBy("userId")
        .orderBy("createdAt", "desc")
        .limit(limit);
    } else {
      query = baseQuery.orderBy("createdAt", "desc").limit(limit);
    }

    const interviews = await query.get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error in getLatestInterviews:", error);
    return [];
  }
}

export async function getUniqueInterviewById(id) {
  if (!id) return null;

  try {
    const interviewDoc = await db.collection("interviews").doc(id).get();
    if (!interviewDoc.exists) return null;

    return { id: interviewDoc.id, ...interviewDoc.data() };
  } catch (error) {
    console.error("Error in getUniqueInterviewById:", error);
    return null;
  }
}

export async function createFeedback(params) {
  const { interviewId, userId, transcript } = params || {};

  if (!interviewId || !userId || !Array.isArray(transcript)) {
    console.warn("createFeedback: missing required params");
    return { success: false, message: "Missing required parameters." };
  }

  try {
    // Dynamic import only on server
    const { google } = await import("@ai-sdk/google");

    const formattedTranscript = transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
          You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
          Transcript:
          ${formattedTranscript}

          Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
          - **Communication Skills**: Clarity, articulation, structured responses.
          - **Technical Knowledge**: Understanding of key concepts for the role.
          - **Problem-Solving**: Ability to analyze problems and propose solutions.
          - **Cultural & Role Fit**: Alignment with company values and job role.
          - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
          `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const {
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
    } = object || {};

    const feedbackRef = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedbackRef.id,
    };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(params = {}) {
  const { interviewId, userId } = params || {};

  if (!interviewId || !userId) return null;

  try {
    const feedbackSnap = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (feedbackSnap.empty) return null;

    const feedbackDoc = feedbackSnap.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() };
  } catch (error) {
    console.error("Error in getFeedbackByInterviewId:", error);
    return null;
  }
}
