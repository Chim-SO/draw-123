import AppCanvas from "@/components/common/AppCanvas";
import DrawingCanvas from "@/components/drawingCanvas/DrawingCanvas";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 p-10">
      <h1>Draw Something!</h1>
      <DrawingCanvas />
    </div>
  );
}
