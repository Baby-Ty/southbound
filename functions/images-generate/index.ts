import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import OpenAI from 'openai';
import { corsHeaders, createCorsResponse } from '../shared/cors';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy',
});

export async function imagesGenerate(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    (context as any).res = {
      status: 204,
      headers: corsHeaders,
    }; return;
  }

  if (!process.env.OPENAI_API_KEY) {
    (context as any).res = createCorsResponse({ error: 'OpenAI API key missing' }, 500); return;
  }

  try {
    const body = req.body as { prompt?: string };
    const { prompt } = body;

    if (!prompt) {
      (context as any).res = createCorsResponse({ error: 'Prompt required' }, 400); return;
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A high quality, photorealistic travel photograph of ${prompt}. Professional lighting, beautiful scenery, 4k.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    (context as any).res = createCorsResponse({ url: response.data[0].url }); return;
  } catch (error: any) {
    context.log(`OpenAI Error: ${error instanceof Error ? error.message : String(error)}`);
    (context as any).res = createCorsResponse({ error: 'Failed to generate image' }, 500); return;
  }
}

module.exports = { imagesGenerate };
