import { NextRequest, NextResponse } from 'next/server';

// Next.js route segment config must be statically analyzable (no env conditionals).
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, country, title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    if (description.length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters' },
        { status: 400 }
      );
    }

    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      return NextResponse.json({
        polishedDescription: enhanceDescriptionManually(description, title, city, country),
      });
    }

    const locationInfo = city && country ? `in ${city}, ${country}` : city ? `in ${city}` : '';
    
    const prompt = `You are a professional travel content writer. Polish and enhance this activity description to make it more engaging, informative, and travel-focused.

Activity Title: ${title}
Location: ${locationInfo}
Original Description:
${description}

Please enhance this description to:
1. Make it more engaging and compelling (250-300 words)
2. Use vivid, descriptive language that helps travelers visualize the experience
3. Include practical details that travelers would find useful
4. Maintain the original meaning and key information
5. Write in a warm, inviting tone suitable for travel content
6. Structure it with clear paragraphs for readability

Return ONLY the polished description text, without any additional commentary or formatting.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel content writer who creates engaging, informative descriptions for activities and attractions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Polish Description] OpenAI API error:', response.status, errorText);
      return NextResponse.json({
        polishedDescription: enhanceDescriptionManually(description, title, city, country),
      });
    }

    const data = await response.json();
    const polishedDescription = data.choices[0]?.message?.content?.trim() || description;

    return NextResponse.json({
      polishedDescription,
    });
  } catch (error: any) {
    console.error('[Polish Description] Error:', error);
    const { description, title, city, country } = await request.json().catch(() => ({}));
    return NextResponse.json({
      polishedDescription: enhanceDescriptionManually(description || '', title || '', city || '', country || ''),
    });
  }
}

function enhanceDescriptionManually(
  description: string,
  title: string,
  city?: string,
  country?: string
): string {
  const locationStr = city && country ? `${city}, ${country}` : city || country || 'this destination';
  
  if (description.length > 100) {
    let polished = description.trim();
    if (polished[0] !== polished[0].toUpperCase()) {
      polished = polished[0].toUpperCase() + polished.slice(1);
    }
    if (!polished.match(/[.!?]$/)) {
      polished += '.';
    }
    if (polished.length < 200) {
      polished += ` This experience offers something special for travelers visiting ${locationStr}.`;
    }
    return polished;
  }
  
  return `${description.trim()} Experience ${title}${city ? ` in ${city}` : ''} and discover what makes this activity special. Whether you're seeking adventure, culture, or relaxation, this experience offers something memorable for travelers visiting ${locationStr}. Plan your visit to make the most of this unique opportunity.`;
}
