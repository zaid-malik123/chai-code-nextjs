import { streamText } from "ai";
import { google } from "@ai-sdk/google";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("API key missing");
}

export const runtime = "edge";

export async function GET() {
  try {
    const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string.
Each question should be separated by '||'.
These questions are for an anonymous social messaging platform.
Avoid personal or sensitive topics.
Keep it friendly and engaging.
`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}
