"use server";

import { feedbackSchema } from "@/constants"; // kept for reference / validation if needed
import { db } from "@/firebase/admin";
import Groq from "groq-sdk";


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

/**
 * createFeedback
 * - Uses Groq (llama-3.1-8b-instant) to generate a structured JSON evaluation.
 * - Expects `transcript` as an array of { role, content } items.
 * - Saves parsed feedback into Firestore under `feedback`.
 */
export async function createFeedback(params) {
  const { interviewId, userId, transcript } = params || {};

  if (!interviewId || !userId || !Array.isArray(transcript)) {
    console.warn("createFeedback: missing required params");
    return { success: false, message: "Missing required parameters." };
  }

  try {
    // Initialize Groq client (ensure GROQ_API_KEY is present in env)
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const formattedTranscript = transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}`)
      .join("\n");

    // Instruct the model to return a strict JSON object with the exact fields we want.
    const systemPrompt = `You are a strict evaluator for mock interviews. Output MUST be a single valid JSON object and nothing else. Fields required:
- totalScore: number (0-100)
- categoryScores: object with keys "Communication Skills", "Technical Knowledge", "Problem-Solving", "Cultural & Role Fit", "Confidence & Clarity" (each 0-100)
- strengths: array of short strings
- areasForImprovement: array of short strings
- finalAssessment: a concise paragraph summarizing candidate's performance

Do NOT include any extra fields. Do NOT include explanations outside the JSON.`;

    const userPrompt = `Transcript:
${formattedTranscript}

Score and evaluate based on the categories listed in the system prompt. Be objective and specific. Provide numeric scores and short actionable feedback.`;

    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.0,
      max_tokens: 800,
    });

    const text = resp?.choices?.[0]?.message?.content ?? "";

    // Try to parse JSON directly, otherwise attempt to extract JSON object substring.
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Extract the first {...} object block
      const objMatch = text.match(/\{[\s\S]*\}/);
      if (objMatch) {
        try {
          parsed = JSON.parse(objMatch[0]);
        } catch (e2) {
          parsed = null;
        }
      }
    }

    if (!parsed || typeof parsed !== "object") {
      console.error("createFeedback: AI output not parseable as JSON:", text);
      return { success: false, message: "AI output parsing failed", raw: text };
    }

    // Validate essential fields presence and types (lightweight)
    const {
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
    } = parsed;

    if (
      typeof totalScore !== "number" ||
      typeof categoryScores !== "object" ||
      !Array.isArray(strengths) ||
      !Array.isArray(areasForImprovement) ||
      typeof finalAssessment !== "string"
    ) {
      console.warn("createFeedback: parsed object missing expected fields", parsed);
      // Still save raw parsed object so you can inspect it later
    }

    const feedbackRef = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore: typeof totalScore === "number" ? totalScore : null,
      categoryScores: categoryScores || null,
      strengths: Array.isArray(strengths) ? strengths : [],
      areasForImprovement: Array.isArray(areasForImprovement) ? areasForImprovement : [],
      finalAssessment: typeof finalAssessment === "string" ? finalAssessment : "",
      rawAIOutput: text,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedbackRef.id,
    };
  } catch (error) {
    console.error("Error saving feedback (createFeedback):", error);
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
  } 
  catch (error) {
    console.error("Error in getFeedbackByInterviewId:", error);
    return null;
  }
}
