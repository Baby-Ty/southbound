/**
 * AI Description Generation for Activities
 * 
 * This module provides AI-powered description generation for activities
 * when TripAdvisor data is lacking or insufficient.
 */

interface GenerateDescriptionParams {
  name: string;
  category?: string;
  subcategories?: string[];
  city?: string;
  country?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: string;
}

interface GeneratedDescription {
  shortDescription: string;
  fullDescription: string;
  highlights?: string[];
  bestTimeToVisit?: string;
  whatToKnow?: string[];
  itinerary?: {
    stops: {
      title: string;
      description?: string;
      duration?: string;
    }[];
  };
  inclusions?: string[];
  exclusions?: string[];
  cancellationPolicy?: string;
  accessibility?: string[];
  meetingPoint?: string;
}

/**
 * Generate an AI description for an activity using OpenAI or fallback to template
 */
export async function generateActivityDescription(
  params: GenerateDescriptionParams
): Promise<GeneratedDescription> {
  const {
    name,
    category,
    subcategories,
    city,
    country,
    rating,
    reviewCount,
    priceLevel,
  } = params;

  // Try OpenAI first if API key is available
  const openAIKey = process.env.OPENAI_API_KEY;
  
  if (openAIKey) {
    try {
      return await generateWithOpenAI(params, openAIKey);
    } catch (error) {
      console.error('OpenAI generation failed, falling back to template:', error);
    }
  }

  // Fallback to template-based generation
  return generateWithTemplate(params);
}

/**
 * Generate description using OpenAI
 */
async function generateWithOpenAI(
  params: GenerateDescriptionParams,
  apiKey: string
): Promise<GeneratedDescription> {
  const {
    name,
    category,
    subcategories,
    city,
    country,
    rating,
    reviewCount,
    priceLevel,
  } = params;

  const locationInfo = city && country ? `in ${city}, ${country}` : '';
  const categoryInfo = category ? `(${category})` : '';
  const subcatInfo = subcategories?.length ? `Tags: ${subcategories.join(', ')}` : '';
  const ratingInfo = rating ? `Rated ${rating}/5 stars with ${reviewCount || 0} reviews` : '';
  const priceInfo = priceLevel ? `Price level: ${priceLevel}` : '';

  const prompt = `You are a travel content writer. Generate engaging, detailed, and structured content for this activity/attraction:

Activity: ${name} ${categoryInfo}
Location: ${locationInfo}
${subcatInfo}
${ratingInfo}
${priceInfo}

Please provide detailed information in the following JSON format:
{
  "shortDescription": "A compelling 150-180 char teaser.",
  "fullDescription": "3-4 engaging paragraphs about the experience.",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4", "Highlight 5"],
  "bestTimeToVisit": "Best time/season/day to visit.",
  "whatToKnow": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
  "itinerary": {
    "stops": [
      { "title": "Stop/Phase 1", "description": "What happens here", "duration": "Duration (e.g. 30 mins)" },
      { "title": "Stop/Phase 2", "description": "What happens here", "duration": "Duration" }
    ]
  },
  "inclusions": ["Included item 1", "Included item 2"],
  "exclusions": ["Excluded item 1", "Excluded item 2"],
  "cancellationPolicy": "Standard cancellation policy (e.g. Free cancellation up to 24 hours before start).",
  "accessibility": ["Accessibility feature 1", "Accessibility feature 2"],
  "meetingPoint": "General meeting point description or 'See confirmation email'."
}

If specific details (like itinerary stops) are not strictly applicable (e.g. for a museum entry vs a tour), adapt them to make sense (e.g. 'Explore Exhibit A', 'Visit Gallery B') or keep them brief.
Make the content authentic, exciting, and helpful.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content in OpenAI response');
  }

  // Parse the JSON response
  try {
    const generated = JSON.parse(content);
    return generated as GeneratedDescription;
  } catch (e) {
    console.error("Failed to parse OpenAI JSON response", content);
    throw e;
  }
}

/**
 * Generate description using templates (fallback when AI is unavailable)
 */
function generateWithTemplate(
  params: GenerateDescriptionParams
): GeneratedDescription {
  const {
    name,
    category,
    subcategories,
    city,
    country,
    rating,
    priceLevel,
  } = params;

  const locationStr = city && country ? `${city}, ${country}` : city || country || 'this destination';
  const categoryStr = category || 'attraction';

  // Template-based short description
  const shortDescTemplates = [
    `Discover ${name}, a must-visit ${categoryStr} in ${locationStr}.`,
    `Experience ${name}, one of ${locationStr}'s top attractions.`,
    `Visit ${name} and explore this popular ${categoryStr} in ${locationStr}.`,
    `${name} offers an unforgettable experience in ${locationStr}.`,
  ];
  const shortDescription = shortDescTemplates[Math.floor(Math.random() * shortDescTemplates.length)];

  // Template-based full description
  let fullDescription = `${name} is ${getArticle(categoryStr)} ${categoryStr} located in ${locationStr}. `;

  if (rating && rating >= 4) {
    fullDescription += `With an impressive ${rating} out of 5 star rating, this popular destination attracts visitors from around the world. `;
  }

  if (subcategories && subcategories.length > 0) {
    fullDescription += `Visitors can enjoy ${subcategories.slice(0, 2).join(' and ')} experiences here. `;
  }

  fullDescription += `Whether you're a first-time visitor or a returning traveler, ${name} offers something special for everyone. `;
  
  if (priceLevel) {
    const priceDesc = priceLevel === '$' ? 'budget-friendly' : 
                     priceLevel === '$$' ? 'moderately priced' :
                     priceLevel === '$$$' ? 'premium' : 'luxury';
    fullDescription += `This ${priceDesc} experience provides great value for your travel budget. `;
  }

  fullDescription += `Plan your visit to make the most of your time at this remarkable location.`;

  // Template-based highlights
  const highlights = [
    `Located in ${locationStr}`,
    rating ? `Highly rated (${rating}/5 stars)` : 'Popular with travelers',
  ];

  if (subcategories && subcategories.length > 0) {
    highlights.push(...subcategories.slice(0, 3).map(s => `${s} experience`));
  }

  // Template-based best time
  const bestTimeToVisit = 'Visit during morning hours or weekdays to avoid crowds. Check seasonal hours before planning your trip.';

  // Template-based what to know
  const whatToKnow = [
    'Check official website for current opening hours',
    'Booking in advance is recommended during peak season',
    'Allow sufficient time to fully explore and enjoy',
  ];

  return {
    shortDescription: shortDescription.substring(0, 180),
    fullDescription,
    highlights,
    bestTimeToVisit,
    whatToKnow,
    itinerary: {
      stops: [
        { title: "Arrival & Entry", description: "Arrive at the main entrance and present your tickets.", duration: "15 mins" },
        { title: "Main Exploration", description: "Explore the key exhibits and attractions.", duration: "1-2 hours" },
        { title: "Gift Shop & Departure", description: "Visit the shop for souvenirs before leaving.", duration: "20 mins" }
      ]
    },
    inclusions: ["Admission/Entry"],
    exclusions: ["Food and drinks", "Hotel pickup and drop-off"],
    cancellationPolicy: "Free cancellation up to 24 hours before the start of the activity.",
    accessibility: ["Wheelchair accessible"],
    meetingPoint: name
  };
}

/**
 * Helper function to get correct article (a/an)
 */
function getArticle(word: string): string {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(word[0].toLowerCase()) ? 'an' : 'a';
}

/**
 * Check if an activity needs AI enhancement
 */
export function needsAIEnhancement(activity: any): boolean {
  // Needs enhancement if lacking description or key fields
  return (
    !activity.description ||
    activity.description.length < 100 ||
    !activity.highlights ||
    activity.highlights.length === 0
  );
}
