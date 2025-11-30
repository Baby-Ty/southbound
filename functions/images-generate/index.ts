import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import OpenAI from 'openai';
import { corsHeaders, createCorsResponse } from '../shared/cors';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy',
});

export async function imagesGenerate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return createCorsResponse({ error: 'OpenAI API key missing' }, 500);
  }

  try {
    const body = await request.json() as { prompt?: string };
    const { prompt } = body;

    if (!prompt) {
      return createCorsResponse({ error: 'Prompt required' }, 400);
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A high quality, photorealistic travel photograph of ${prompt}. Professional lighting, beautiful scenery, 4k.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    return createCorsResponse({ url: response.data[0].url });
  } catch (error: any) {
    context.log(`OpenAI Error: ${error instanceof Error ? error.message : String(error)}`);
    return createCorsResponse({ error: 'Failed to generate image' }, 500);
  }
}

app.http('images-generate', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: imagesGenerate,
});

