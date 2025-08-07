"use client";
import React, { useEffect, useRef, useState } from "react";

interface DrawerProps {
  children?: React.ReactNode;
}
export default function Drawer({ children }: DrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
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

    ctxRef.current.fillStyle = FILL_COLOR;
    ctxRef.current.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };
  return (
    <div className="bg-gray-200 p-4 space-y-4">
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
          onClick={clearCanvas}
          className="flex-1 bg-blue-500 text-white py-2 rounded"
        >
          Clear
        </button>
        <button className="flex-1 bg-green-500 text-white py-2 rounded">
          Predict
        </button>
      </div>
    </div>
  );
}
