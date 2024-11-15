// src/app/api/openai/route.ts
import { NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(req: Request) {
  try {
    const { text } = await req.json(); // Extract text from the request body

    if (!text) {
      return NextResponse.json({ message: 'No text provided' }, { status: 400 });
    }

    // Call OpenAI's API
    const openaiResponse = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`, // Use your OpenAI API Key
      },
      body: JSON.stringify({
        model: 'text-davinci-003',  // Use the model you want to interact with
        prompt: text,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await openaiResponse.json();

    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({
        openai_response: data.choices[0].text.trim(),
        status: true,
        message: 'Success',
      });
    } else {
      return NextResponse.json({
        openai_response: 'No response from OpenAI.',
        status: false,
        message: 'No response from OpenAI.',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json({
      openai_response: 'Error communicating with OpenAI.',
      status: false,
      message: 'Error communicating with OpenAI.',
    }, { status: 500 });
  }
}
