import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * POST /api/linkedin/generate
 *
 * Generates LinkedIn post content, titles, and hashtags using OpenAI.
 * Uses the South Bound Content Engine as the system prompt.
 *
 * Body:
 *   action:  'post' | 'title' | 'hashtags'
 *   type:    'city-series' | 'lifestyle' | 'practical' | 'inspiration' | 'reel'
 *   city?:   string
 *   day?:    1-7  (city series only)
 *   topic?:  string (free-form topic or idea)
 *   content? string (used for title/hashtag generation from existing text)
 */

const SYSTEM_PROMPT = `You are a LinkedIn content creator for South Bound — a company that helps South African remote workers live and work abroad for 90 to 360 days at a time. Multi-destination slow travel, around 30 days per city.

BRAND VOICE:
Peer-to-peer. Like advice from a smart friend who has lived in 10 countries and wants to share what they found. Not a travel agency. Not a marketing team. Friendly, clear, inspiring, practical, slightly adventurous.

WHO YOU'RE WRITING FOR:
South African remote workers aged 25 to 40. They have remote jobs and can work from anywhere. They're not being convinced to travel — they're already thinking about it. You're showing them how to do it well. They earn in rands and understand South African costs.

NON-NEGOTIABLE WRITING RULES:
- No em-dashes
- No AI phrases: "certainly", "absolutely", "of course", "dive into", "delve into", "it's worth noting"
- No corporate or brochure tone
- Short sentences. Short paragraphs. Leave white space.
- Hooks must be specific and visual — not vague travel clichés
- Use rands for cost comparisons (e.g. "R15k/month for a villa", "R18k all-in per month")
- Name real places, give real price ranges, describe real experiences
- Max 3-5 hashtags, always at the very bottom separated by a blank line

CITY SERIES — 7-POST SEQUENCE PER CITY:
Day 1 — City Introduction: Hook like "Ever thought about living in [City] for 3 months instead of just visiting?"
Day 2 — Accommodation: Hook like "What R15,000–R22,000/month gets you in [Neighbourhood]."
Day 3 — Work Setup: Hook like "Your office for the next 90 days." Cover coworking spaces, cafes, internet quality.
Day 4 — Food Scene: Hook like "One of the best food scenes in Southeast Asia." Specific dishes, markets, price ranges.
Day 5 — Fitness / Gyms: Hook like "The gym culture in [City] is next level." Cover gyms, muay thai, yoga, outdoor options.
Day 6 — Weekend Adventures: Hook like "What weekends look like living in [City]." Day trips, activities, beaches, culture.
Day 7 — Community: Hook like "[Number] remote workers already call this city home." Digital nomad scene, meetups, coworking community.

LIFESTYLE POSTS: Cost comparisons (Cape Town vs elsewhere), day-in-the-life breakdowns, common mistakes SA workers make, practical tips
PRACTICAL POSTS: Visa info for SA passports, minimum income needed, packing, SIM cards, finding accommodation
INSPIRATION POSTS: City lists with notes, festivals worth timing trips around, surprising comparisons or facts
REEL CONCEPTS: POV video ideas, cost of living comparisons, "Where remote workers live in [City]"

HOOK WRITING GUIDE — Good hooks do one of:
- Challenge an assumption: "You don't need a career break to live in Bali."
- Make a specific comparison: "Your Cape Town rent = 3 months in Chiang Mai."
- Paint a vivid picture: "Gym at 7am. Coffee and emails by 9. Surfing by 4."
- State a surprising fact: "Thailand gives South Africans 60 days visa-free at the airport."

BAD hooks: "Bali is amazing for remote work." / "Have you ever thought about working abroad?" / "This city has so much to offer."

LINKEDIN FORMAT:
- First 2-3 lines must make someone click "see more"
- Short lines perform better than dense paragraphs
- Body: 3-5 bullet points or short paragraphs with clear line breaks
- End with a CTA question where natural (e.g. "Which city would you want to work from?")

SOUTH AFRICAN CONTEXT:
- Always frame costs relative to what SA remote workers already pay
- Highlight that the SA passport is actually well-served in priority destinations (SEA, Latin America)
- The lifestyle angle: earn in rands, live for less, experience more

OUTPUT FORMAT FOR POSTS:
Write the post exactly as it would appear on LinkedIn. Start with the hook as the first line. No headers, no labels, no "HOOK:" prefix. Just the post. Hashtags at the very end, separated by a blank line.

OUTPUT FORMAT FOR TITLES:
Return only the title — 5 to 10 words, descriptive and scannable. No quotes, no prefix.

OUTPUT FORMAT FOR HASHTAGS:
Return 3 to 5 relevant hashtags on one line, space-separated. Nothing else.`;

function buildPostPrompt(
  type: string,
  city?: string,
  day?: number,
  topic?: string
): string {
  if (type === 'city-series' && city && day) {
    const dayTopics: Record<number, string> = {
      1: 'city introduction — why this city works for remote workers, what the vibe is like, cost overview',
      2: 'accommodation — what you can rent per month, best neighbourhoods, typical apartment specs and costs in rands',
      3: 'work setup — coworking spaces, work-friendly cafes, internet quality, what a typical workday looks like',
      4: 'food scene — restaurants, markets, street food, typical meal costs, must-try dishes',
      5: 'fitness and gyms — gym culture, costs, options (muay thai, yoga, climbing, etc.), outdoor fitness',
      6: 'weekend adventures — day trips, activities, beaches, nightlife, cultural experiences nearby',
      7: 'community — digital nomad community size, meetups, coworking social scene, how easy it is to meet people',
    };
    return `Write a LinkedIn City Series post for ${city}. This is Day ${day}: ${dayTopics[day] || 'overview'}.

Write it in full, ready to post on LinkedIn. Start with a strong hook on the first line. Use the South Bound brand voice throughout.`;
  }

  if (type === 'lifestyle' && topic) {
    return `Write a LinkedIn Lifestyle post about: ${topic}

Write it in full, ready to post on LinkedIn. Start with a strong hook. Frame it for South African remote workers considering working abroad.`;
  }

  if (type === 'practical' && topic) {
    return `Write a practical LinkedIn post about: ${topic}

Angle: useful information for South African remote workers. Cover the specifics — don't be vague. Start with a strong hook.`;
  }

  if (type === 'inspiration') {
    return `Write an inspiration/discovery LinkedIn post${topic ? ` about: ${topic}` : city ? ` featuring ${city}` : ''}.

Format: could be a list post (5-7 bullet points) or a compelling story. Start with a surprising hook. High reach potential.`;
  }

  if (type === 'reel') {
    return `Write a short-form video (Reel) script concept for LinkedIn${city ? ` about ${city}` : topic ? ` about: ${topic}` : ''}.

Format: shot-by-shot concept with voiceover lines. Keep it punchy and visual. 30-60 seconds. South Bound brand voice.`;
  }

  // Fallback
  return `Write a LinkedIn post${topic ? ` about: ${topic}` : city ? ` about working remotely in ${city}` : ' about slow travel remote work'}. South Bound brand voice. Ready to post.`;
}

function buildTitlePrompt(
  type: string,
  city?: string,
  day?: number,
  content?: string
): string {
  if (content) {
    return `Give this LinkedIn post a short internal title (5-10 words) for filing and reference purposes. Just the title, nothing else.

Post content:
${content.slice(0, 300)}`;
  }

  if (type === 'city-series' && city && day) {
    const dayLabels: Record<number, string> = {
      1: 'City Intro',
      2: 'Accommodation',
      3: 'Work Setup',
      4: 'Food Scene',
      5: 'Fitness',
      6: 'Weekends',
      7: 'Community',
    };
    return `Give a short internal title (5-10 words) for a ${city} Day ${day} LinkedIn post about ${dayLabels[day] || 'overview'}. Just the title.`;
  }

  return `Give a short internal title (5-10 words) for a South Bound ${type} LinkedIn post${city ? ` about ${city}` : ''}. Just the title.`;
}

function buildHashtagsPrompt(content?: string, type?: string, city?: string): string {
  return `Generate 3 to 5 LinkedIn hashtags for this South Bound post. Return only the hashtags space-separated, nothing else.

Rules:
- Mix specific and broad (e.g. #BaliRemoteWork #DigitalNomad #SouthAfrica)
- Always include at least one South Africa/South African angle where relevant
- No generic spam hashtags like #travel #life
- Relevant to remote work, slow travel, or the specific city/topic

Context:
- Type: ${type || 'general'}
- City: ${city || 'not specified'}
- Post excerpt: ${content ? content.slice(0, 400) : 'no content yet'}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, type, city, day, topic, content } = body;

    if (!action) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });

    let userPrompt = '';
    let maxTokens = 800;

    if (action === 'post') {
      userPrompt = buildPostPrompt(type, city, day, topic);
      maxTokens = 800;
    } else if (action === 'title') {
      userPrompt = buildTitlePrompt(type, city, day, content);
      maxTokens = 40;
    } else if (action === 'hashtags') {
      userPrompt = buildHashtagsPrompt(content, type, city);
      maxTokens = 60;
    } else {
      return NextResponse.json({ error: 'action must be post, title, or hashtags' }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.82,
      max_tokens: maxTokens,
    });

    const result = response.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('[LinkedIn Generate] Error:', error);
    return NextResponse.json(
      { error: 'Generation failed', message: error.message },
      { status: 500 }
    );
  }
}
