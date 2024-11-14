// src/app/api/ask-ai/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Handle the AI query processing here
  const userQuery = data.query;

  // Simulate a response (replace with real AI processing logic)
  return NextResponse.json({ response: `You asked: ${userQuery}` });
}
