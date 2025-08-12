"use client";
import Image from "next/image";
import Drawer from "./Drawer";
import { useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [prediction, setPrediction] = useState<{
    class: number;
    confidence: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    ctxRef.current.fillStyle = "#fff";
    ctxRef.current.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setPrediction(null);
  };

  const predict = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64Image = canvas.toDataURL("image/png");

    // strip off prefix
    const base64 = base64Image.replace(/^data:image\/png;base64,/, "");
    console.log("Image ready for prediction!");

    // setPrediction(result.predictions);
    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 p-10">
      <h1 className="text-5xl font-bold bg-white border-4 border-black">
        Write a Number (0–9)!
      </h1>
      <Drawer
        canvasRef={canvasRef}
        ctxRef={ctxRef}
        predict={predict}
        clear={clearCanvas}
        predictText={loading ? "Predicting..." : "Predict"}
      ></Drawer>
      {prediction && (
        <h2 className="text-3xl bg-white">
          {" "}
          Emm, you were trying to write: {prediction.class}. I'm{" "}
          {(prediction.confidence * 100).toFixed(2)}% confident!
        </h2>
      )}
    </div>
  );
}
