import OpenAI from "openai";
import {
  streamText,
  convertToCoreMessages,
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import { error } from "console";
import { NextResponse } from "next/server";

const openai = OpenAI.create({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for and anonymous social messaging platform,like Qooh.me,and should be suitable for a diverse audiance. Avoid personal or sensitive topics,focusing instead on universal themes that encourage friendly interaction.For example, your output should be structured like this: What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intruguing,foster curiosity, and contribute to a positive and welcoming conversational enviornment.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5",
      stream: true,
      prompt,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message });
    } else {
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}
