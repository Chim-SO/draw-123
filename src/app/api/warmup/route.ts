import { Client } from "@gradio/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const space = process.env.HF_SPACE;
    if (!space) throw new Error("Missing HF_SPACE environment variable");
    // await Client.connect(space);
    await fetch(`https://${space.replaceAll("/", "-")}.hf.space/`, {
      method: "GET",
    });
    return NextResponse.json({ status: "ok", message: "Model warmed up" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
