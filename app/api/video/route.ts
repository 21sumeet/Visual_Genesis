
import  auth  from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
  useFileOutput:false ,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    

    const response = await replicate.run("lightricks/ltx-video:c441c271f0cfd578aa0cd14a8488329dd10b796313a9335573a4a63507a976a5", {
      input: {
        prompt,
      },
    });

    

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}