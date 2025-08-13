import { NextResponse } from "next/server";

interface PredictRequest {
  image_base64: string;
}

interface ModelPrediction {
  class: string;
  confidence: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PredictRequest;

    const response = await fetch("http://127.0.0.1:5000/invocations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [
          {
            image_base64: body.image_base64,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`ML server returned ${response.status}`);
    }

    const result = await response.json();
    const prediction = (result.predictions ?? null) as ModelPrediction | null;
    if (!prediction) {
      return NextResponse.json(
        { error: "No prediction returned from model" },
        { status: 500 }
      );
    }

    return NextResponse.json({ prediction });
  } catch (error: unknown) {
    // Type guard: check if error is an Error object and has message
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
