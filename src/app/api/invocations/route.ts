import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const mlflowResponse = await fetch("http://127.0.0.1:5000/invocations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const mlflowResult = await mlflowResponse.json();

    return NextResponse.json(mlflowResult);
  } catch (error: unknown) {
    // Type guard: check if error is an Error object and has message
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
