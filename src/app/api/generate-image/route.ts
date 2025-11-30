import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPromptForCategory, ImageCategory, PromptContext } from '@/lib/dallePrompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, context, customPrompt } = body;

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // If custom prompt is provided, use it; otherwise generate from template
    let prompt: string;
    
    if (customPrompt) {
      // Add master style suffix even to custom prompts
      const masterStyle = `shot on Sony A7R IV, 35mm lens, f/2.8, cinematic natural lighting, editorial travel photography style, high resolution, 8k, incredibly detailed, rule of thirds, authentic atmosphere, no text, photorealistic, wide angle shot, panoramic composition, 16:9 aspect ratio, centered subject to allow for cropping. Avoid: cartoonish, 3D render style, unnatural saturation, oversaturated, excessive bloom, blurry foreground.`;
      prompt = `${customPrompt} ${masterStyle}`;
    } else {
      const promptContext: PromptContext = context || {};
      prompt = getPromptForCategory(category as ImageCategory, promptContext);
    }

    // Call DALL-E 3 API
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024', // Landscape format for city cards
      quality: 'hd',
      response_format: 'url',
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: prompt, // Return the prompt used for reference
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    
    // Handle OpenAI API errors
    if (error.response) {
      return NextResponse.json(
        { 
          error: error.response.data?.error?.message || 'Failed to generate image',
          details: error.response.data 
        },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}


