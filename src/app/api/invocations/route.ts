import { NextResponse } from "next/server";
import { Client } from "@gradio/client";

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

    const client = await Client.connect("ChimSO/HWDC");
    const result = await client.predict("/predict", {
      image_base64: body.image_base64,
    });

    const predictions = result.data as ModelPrediction[];
    if (!predictions) {
      return NextResponse.json(
        { error: "No prediction returned from model" },
        { status: 500 }
      );
    }

    return NextResponse.json({ prediction: predictions[0] });
  } catch (error: unknown) {
    // Type guard: check if error is an Error object and has message
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
