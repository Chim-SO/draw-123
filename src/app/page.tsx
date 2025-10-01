"use client";
import Drawer from "./Drawer";
import { useEffect, useState } from "react";

export default function Home() {
  const [prediction, setPrediction] = useState<{
    class: number;
    confidence: number;
  } | null>(null);

  const [statusMessage, setStatusMessage] = useState(
    "⏳ Hmm, waking up the model... please wait a moment!"
  );
  const [isModelReady, setIsModelReady] = useState(false);
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const warmup = async () => {
      console.log("warmup ... ");
      setIsModelReady(false);
      setStatusMessage("⏳ Waking up the model... please wait a moment!");

      intervalId = setInterval(async () => {
        try {
          const res = await fetch("/api/warmup");
          if (res.ok) {
            setStatusMessage("✅ Great news, the model is ready to go!");
            setIsModelReady(true);
            clearInterval(intervalId);
          } else {
            setStatusMessage("⏳ Still waking up the model...");
          }
        } catch {
          setStatusMessage("⏳ Still waking up the model...");
        }
      }, 3000);
    };

    warmup();

    return () => clearInterval(intervalId);
  }, []);

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
    setPrediction(result.prediction);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 p-10">
      <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold bg-white border-4 border-black">
        Draw a Number (0–9)!
      </h1>

      {isModelReady && (
        <>
          <Drawer
            onClear={() => setPrediction(null)}
            OnPredict={getPrediction}
          ></Drawer>
          <h2 className="text-center min-h-14 text-2xl md:text-3xl lg:text-4xl bg-white">
            {prediction && (
              <>
                🤔 Hmm, you were trying to write: {prediction.class}. I am{" "}
                {(prediction.confidence * 100).toFixed(2)}% confident!
              </>
            )}
          </h2>
        </>
      )}
      <p className="flex items-center text-center justify-center text-lg  min-h-14 bg-yellow-100 px-5">
        {statusMessage}
      </p>
    </div>
  );
}
