import { Client } from "@gradio/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const space = process.env.HF_SPACE;
    if (!space) throw new Error("Missing HF_SPACE environment variable");
    const client = await Client.connect(space);
    return NextResponse.json({ status: "ok", message: "Model warmed up" });
  } catch (e: any) {
    return NextResponse.json(
      { status: "error", message: e.message },
      { status: 500 }
    );
  }
}
