;
import { NextResponse } from "next/server";
import Replicate from "replicate";
// import { writeFile } from "node:fs/promises";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
  useFileOutput:false ,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, guidance = 3.5 } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const input = {
      prompt,
      guidance,
      aspect_ratio: "1:1",
      output_format: "jpg",
    };

    const response = await replicate.run("black-forest-labs/flux-dev", {
      input,
    });

    // // Save outputs to disk (optional)
    // for (const [index, item] of Object.entries(response)) {
    //   await writeFile(`output_${index}.webp`, item);
    // }
    console.log("generated output", response);
    return NextResponse.json(response, { status: 200 });
    console.log("Generated Output:", response);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

