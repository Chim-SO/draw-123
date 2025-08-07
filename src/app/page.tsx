import Image from "next/image";
import Drawer from "./Drawer";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 p-10">
      <h1>Draw Something!</h1>
      <Drawer></Drawer>
    </div>
  );
}
