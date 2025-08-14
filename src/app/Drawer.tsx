"use client";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface DrawerProps {
  OnPredict: (base64Image: string) => void;
  onClear: () => void;
}
export default function Drawer({ OnPredict, onClear }: DrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [loading, setLoading] = useState(false);
  const [emptyCanvas, setEmptyCanvas] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const FILL_COLOR = "#fff";

  const [isDrawing, setIsDrawing] = useState(false);
  const getSize = () => {
    if (window.innerWidth >= 640) {
      return { width: 500, height: 500 };
    } else {
      return { width: 224, height: 224 };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const size = getSize();
      setCanvasSize(size);

      canvas.width = size.width;
      canvas.height = size.height;

      ctx.clearRect(0, 0, size.width, size.height);
      ctx.fillStyle = FILL_COLOR;
      ctx.fillRect(0, 0, size.width, size.height);

      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctxRef.current = ctx;
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const drawLine = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(start.x, start.y);
    ctxRef.current.lineTo(end.x, end.y);
    ctxRef.current.stroke();
    ctxRef.current.closePath();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
    setEmptyCanvas(false);
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

  const getTouchPos = (canvas: HTMLCanvasElement, touchEvent: TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  };

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const pos = getTouchPos(canvasRef.current, e.nativeEvent);
    setIsDrawing(true);
    setLastPos(pos);
    setEmptyCanvas(false);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPos || !canvasRef.current) return;
    const pos = getTouchPos(canvasRef.current, e.nativeEvent);
    drawLine(lastPos, pos);
    setLastPos(pos);
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
    setEmptyCanvas(true);
    onClear();
  };

  const predict = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64Image = canvas.toDataURL("image/png");

    if (!emptyCanvas) await OnPredict(base64Image);
    else
      toast.error(
        "Oops! The drawing box is empty. Try drawing a number first."
      );
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
        onTouchStart={startDrawingTouch}
        onTouchMove={drawTouch}
        onTouchEnd={stopDrawing}
        width={canvasSize.width}
        height={canvasSize.height}
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
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
