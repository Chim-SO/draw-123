"use client";
import React, { useEffect, useRef, useState } from "react";

interface DrawerProps {
  OnPredict: (base64Image: string) => void;
  onClear: () => void;
}
export default function Drawer({ OnPredict, onClear }: DrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [loading, setLoading] = useState(false);
  const FILL_COLOR = "#fff";

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctxRef.current = ctx;

    ctxRef.current.fillStyle = FILL_COLOR;
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

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
    onClear();
  };

  const predict = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64Image = canvas.toDataURL("image/png");

    await OnPredict(base64Image);
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 space-y-4">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-black bg-white cursor-crosshair"
      />

      <div className="flex w-full space-x-4">
        <button
          className="flex-1 text-xl bg-white text-black py-2 border-2 rounded border-black
          hover:bg-gray-500 hover:cursor-pointer"
          onClick={clearCanvas}
        >
          Clear
        </button>
        <button
          className="flex-1 text-xl bg-black text-white py-2 rounded border-2 border-white hover:bg-gray-500 hover:cursor-pointer"
          onClick={predict}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>
    </div>
  );
}
