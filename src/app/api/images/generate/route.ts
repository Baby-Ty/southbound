import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy', // Prevent crash if missing, but check in handler
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key missing' }, { status: 500 });
  }

  try {
    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A high quality, photorealistic travel photograph of ${prompt}. Professional lighting, beautiful scenery, 4k.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

