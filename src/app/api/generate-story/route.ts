import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Stop {
  city: string;
  duration: number;
}

/**
 * POST /api/generate-story
 *
 * Generates a narrative "The Journey" blurb for a set of stops using OpenAI.
 *
 * Body: { stops: Stop[], templateName?: string }
 * Response: { story: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { stops, templateName } = await request.json();

    if (!stops || !Array.isArray(stops) || stops.length === 0) {
      return NextResponse.json(
        { error: 'stops array is required' },
        { status: 400 }
      );
    }

    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      return NextResponse.json(
        { error: 'OpenAI not configured' },
        { status: 500 }
      );
    }

    const cityList = stops
      .map((s: Stop) => `${s.city} (${s.duration} days)`)
      .join(' → ');

    const prompt = `You are writing copy for South Bound, a travel company helping South African remote workers live and work abroad for 90 to 360 days at a time.

Write a 2–3 sentence narrative for this slow travel route: ${cityList}${templateName ? ` (trip name: ${templateName})` : ''}

Style rules:
- Peer-to-peer, friendly, and genuine — like advice from a well-travelled friend
- Each city gets one vivid, concrete detail (a place, an experience, a feeling)
- Short punchy sentences
- Inspiring but grounded — no travel brochure clichés
- No corporate language, no em-dashes, no filler phrases
- End on a forward-looking or exciting note

Return only the story text. No quotes, no extra commentary.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 220,
        temperature: 0.72,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      return NextResponse.json(
        { error: 'OpenAI API error' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const story = data.choices?.[0]?.message?.content?.trim();

    if (!story) {
      return NextResponse.json(
        { error: 'No story returned from OpenAI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error('generate-story error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}
