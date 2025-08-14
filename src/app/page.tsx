"use client";
import Drawer from "./Drawer";
import { useState } from "react";

export default function Home() {
  const [prediction, setPrediction] = useState<{
    class: number;
    confidence: number;
  } | null>(null);

  const getPrediction = async (base64Image: string) => {
    const base64 = base64Image.replace(/^data:image\/png;base64,/, "");
    const response = await fetch("/api/invocations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_base64: base64,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send data");
      return;
    }

    const result = await response.json();
    console.log(result);
    setPrediction(result.prediction);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 p-10">
      <h1 className="text-5xl font-bold bg-white border-4 border-black">
        Draw a Number (0–9)!
      </h1>
      <Drawer
        onClear={() => setPrediction(null)}
        OnPredict={getPrediction}
      ></Drawer>
      <h2 className="min-h-14 text-3xl bg-white">
        {prediction && (
          <>
            🤔 Hmm, you were trying to write: {prediction.class}. I'm{" "}
            {(prediction.confidence * 100).toFixed(2)}% confident!
          </>
        )}
      </h2>
    </div>
  );
}
