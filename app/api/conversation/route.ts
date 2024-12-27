
import { NextResponse } from "next/server";
import  OpenAIApi  from "openai";
import Configuration from "openai";



const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAi = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { messages } = body;

    

    if (!configuration) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Missing messages", { status: 400 });
    }


    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}