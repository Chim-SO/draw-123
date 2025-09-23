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
    if (process.env.PREDICT_API_TYPE === "hwdcclient")
      return await predictWithHWDCHugs(body.image_base64);
    else if (process.env.PREDICT_API_TYPE === "mlflowlocal")
      return await predictWithMLflowLocalServer(body.image_base64);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function predictWithMLflowLocalServer(image_base64: string) {
  const response = await fetch(process.env.MLFLOW_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [
        {
          image_base64: image_base64,
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
}

async function predictWithHWDCHugs(image_base64: string) {
  const space = process.env.HF_SPACE;
  if (!space) throw new Error("Missing HF_SPACE environment variable");
  const client = await Client.connect(space);
  const result = await client.predict("/predict", {
    image_base64: image_base64,
  });

  const predictions = result.data as ModelPrediction[];
  if (!predictions) {
    return NextResponse.json(
      { error: "No prediction returned from model" },
      { status: 500 }
    );
  }

  return NextResponse.json({ prediction: predictions[0] });
}
