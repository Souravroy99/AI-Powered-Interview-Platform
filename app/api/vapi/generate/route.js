import Groq from "groq-sdk";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export const GET = async () => {
  return Response.json({ success: true, data: "Thank You!" }, { status: 200 });
};

export const POST = async (request) => {
  const { type, role, level, techstack, amount, userid } = await request.json();

  // basic validation
  if (!role || !level || !amount || !userid) {
    return Response.json(
      { success: false, error: "Missing required fields (role, level, amount, userid)" },
      { status: 400 }
    );
  }

  try {
    // init groq client (make sure GROQ_API_KEY is set in your env)
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Build system + user messages for chat completion
    const systemPrompt = 
      `You are an interview question generator. 
      OUTPUT MUST BE a single valid JSON array of strings, nothing else.
      Example: ["Question 1", "Question 2"].
      Do NOT include any extra text, punctuation like "/" or "*" that may break a voice assistant. 
      Keep questions clear and short.`;

    const userPrompt = `Prepare ${amount} interview questions.
                        Role: ${role}
                        Experience level: ${level}
                        Tech stack: ${techstack}
                        Focus: ${type}
                        Return only a JSON array of questions (strings).`;

    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    // Extract text safely
    const text = resp?.choices?.[0]?.message?.content ?? "";
    let questions = JSON.parse(text);

    // // Try parse direct JSON
    // try {
    // } catch (e) {
    //   // fallback: try to extract a JSON array substring
    //   const m = text.match(/\[[\s\S]*\]/);
    //   if (m) {
    //     try {
    //       questions = JSON.parse(m[0]);
    //     } catch (e2) {
    //       questions = null;
    //     }
    //   }
    // }

    // if (!Array.isArray(questions)) {
    //   console.log("Model output could not be parsed as array:", text);
    //   return Response.json(
    //     { success: false, error: "AI output parsing failed", raw: text },
    //     { status: 500 }
    //   );
    // }


    const interview = {
      role,
      type,
      level,
      techstack: (techstack || "").split(",").map((s) => s.trim()).filter(Boolean),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(`api-->vapi-->generate-->Post: ${error}`);
    // avoid leaking the whole error object to client
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
};
