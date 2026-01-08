/**
 * DALL-E 3 Prompt Templates for Southbnd
 * Category-specific prompts with consistent styling
 */

export type ImageCategory = 'city' | 'region' | 'activity' | 'accommodation' | 'culture' | 'highlight';

export interface PromptContext {
  cityName?: string;
  country?: string;
  region?: string;
  activityName?: string;
  accommodationType?: string;
  vibe?: string;
  tags?: string[];
  customContext?: string;
}

// Master style suffix for consistency across all images
const MASTER_STYLE_SUFFIX = `shot on Sony A7R IV, 35mm lens, f/2.8, cinematic natural lighting, editorial travel photography style, high resolution, 8k, incredibly detailed, rule of thirds, authentic atmosphere, no text, photorealistic, wide angle shot, panoramic composition, 16:9 aspect ratio, centered subject to allow for cropping. Avoid: cartoonish, 3D render style, unnatural saturation, oversaturated, excessive bloom, blurry foreground.`;

/**
 * Generate a city prompt
 */
export function getCityPrompt(context: PromptContext): string {
  const { cityName, country, vibe, tags } = context;
  
  // Determine city scale/vibe from tags
  const isMetropolis = tags?.some(t => ['urban', 'city', 'modern'].includes(t.toLowerCase()));
  const isCoastal = tags?.some(t => ['coastal', 'beach', 'surf'].includes(t.toLowerCase()));
  const isHistoric = tags?.some(t => ['history', 'culture', 'temples'].includes(t.toLowerCase()));
  
  let basePrompt = '';
  
  if (isMetropolis) {
    basePrompt = `A stunning wide panoramic street-level view of ${cityName}${country ? `, ${country}` : ''}, showing its vast scale. Towering skyscrapers in the distance contrasting with the busy street life in the foreground.`;
  } else if (isCoastal) {
    basePrompt = `A stunning wide panoramic view of ${cityName}${country ? `, ${country}` : ''}, capturing its unique geography. The city nesting into the coastline, balancing urban buildings with nature. Open composition, breathing room in the sky.`;
  } else if (isHistoric) {
    basePrompt = `A stunning wide panoramic street-level view of ${cityName}${country ? `, ${country}` : ''}, blending historical architecture with modern life. Ancient structures visible in the background, warm golden hour light hitting the buildings.`;
  } else {
    basePrompt = `A stunning wide panoramic street-level view of ${cityName}${country ? `, ${country}` : ''} at sunset, blending historical architecture with modern life. The streets are lively but not crowded, warm golden hour light hitting the buildings, sharp focus, depth of field.`;
  }
  
  return `${basePrompt} ${MASTER_STYLE_SUFFIX}`;
}

/**
 * Generate a region prompt
 */
export function getRegionPrompt(context: PromptContext): string {
  const { region, vibe } = context;
  
  // Map regions to landscape elements
  const regionLandscapes: Record<string, { element1: string; element2: string }> = {
    'south-america': {
      element1: 'lush green Andean valleys with a winding road',
      element2: 'distant snowy peaks'
    },
    'southeast-asia': {
      element1: 'limestone karsts rising out of turquoise water',
      element2: 'a traditional longtail boat in the foreground'
    },
    'south-europe': {
      element1: 'a rugged coastline with turquoise water crashing against cliffs',
      element2: 'olive groves in the foreground'
    },
    'central-east-europe': {
      element1: 'rolling hills with medieval architecture',
      element2: 'forests and rivers'
    }
  };
  
  const landscape = regionLandscapes[region?.toLowerCase() || ''] || {
    element1: 'dramatic landscape',
    element2: 'distant mountains'
  };
  
  const basePrompt = `A breathtaking wide landscape shot capturing the essence of ${region || 'the region'}. Featuring ${landscape.element1} and ${landscape.element2}. Atmospheric lighting, feeling of vastness and adventure, vibrant colors.`;
  
  return `${basePrompt} ${MASTER_STYLE_SUFFIX}`;
}

/**
 * Generate an activity prompt
 */
export function getActivityPrompt(context: PromptContext): string {
  const { activityName, cityName, country } = context;
  
  // Map common activities to specific prompts
  const activityPrompts: Record<string, string> = {
    'surfing': `Action shot of a person surfing a perfect wave at sunset. The water is golden and turquoise, palm trees visible on the shore. Dynamic water spray, high energy.`,
    'hiking': `Over-the-shoulder shot of a hiker standing on a mountain peak looking out over a dramatic coastline. The wind blowing through grass, rugged rocks in foreground, sense of accomplishment.`,
    'night markets': `Eye-level shot walking through a bustling night market${cityName ? ` in ${cityName}` : ''}. Steam rising from street food stalls, glowing red paper lanterns overhead, vibrant bokeh lights, delicious food in focus.`,
    'street food': `Close-up shot of vibrant street food${cityName ? ` in ${cityName}` : ''}. Fresh ingredients, rustic ceramic bowls, wooden table texture. Background slightly blurred bustling restaurant atmosphere.`,
    'temples': `A close-up, detailed shot of intricate stone carvings on an ancient temple wall. Moss growing in the cracks, dappled sunlight filtering through trees, spiritual atmosphere.`,
    'beaches': `A wide shot of a pristine beach${cityName ? ` near ${cityName}` : ''}. Turquoise water, white sand, palm trees swaying. Soft natural light, inviting and relaxing atmosphere.`,
    'coffee': `Interior shot of a stylish café${cityName ? ` in ${cityName}` : ''}. Large windows with natural light, modern rustic decor, wood and stone, indoor plants. A laptop open on a wooden table, inviting and productive atmosphere.`
  };
  
  const normalizedActivity = activityName?.toLowerCase() || '';
  let basePrompt = activityPrompts[normalizedActivity];
  
  if (!basePrompt) {
    // Generic activity prompt
    basePrompt = `Action shot of a person experiencing ${activityName || 'an activity'}${cityName ? ` in ${cityName}` : ''}. POV or over-the-shoulder angle to immerse the viewer. Dynamic motion, authentic travel experience.`;
  }
  
  return `${basePrompt} ${MASTER_STYLE_SUFFIX}`;
}

/**
 * Generate an accommodation prompt
 */
export function getAccommodationPrompt(context: PromptContext): string {
  const { accommodationType, cityName, country, vibe } = context;
  
  const accommodationPrompts: Record<string, string> = {
    'private apartment': `Interior shot of a stylish modern apartment${cityName ? ` in ${cityName}` : ''}. Large windows with a view of the city skyline. Modern furniture, clean lines, indoor plants. Soft natural light streaming in, a laptop open on a wooden table, inviting and productive atmosphere.`,
    'coliving space': `Interior shot of a stylish co-living lounge${cityName ? ` in ${cityName}` : ''}. Large open windows with a view. Modern furniture, bean bags, hanging plants. Soft morning light, community workspace vibe.`,
    'villa': `Interior shot of a luxury villa${cityName ? ` in ${cityName}` : ''}. Floor-to-ceiling windows with a view of tropical surroundings. Bamboo furniture, natural materials, indoor-outdoor living. Pool visible through windows, warm ambient lighting.`,
    'hotel': `Interior shot of a modern hotel room${cityName ? ` in ${cityName}` : ''}. Large windows with city view, contemporary design, comfortable workspace setup. Professional yet inviting atmosphere.`,
    'guesthouse': `Interior shot of a cozy guesthouse${cityName ? ` in ${cityName}` : ''}. Traditional architecture with modern amenities, warm lighting, local decor touches. Inviting and comfortable atmosphere.`,
    'hostel': `Interior shot of a modern hostel${cityName ? ` in ${cityName}` : ''}. Clean, bright common area with comfortable seating, good lighting, social atmosphere. Modern design with travel-inspired decor.`,
    'homestay': `Interior shot of a welcoming homestay${cityName ? ` in ${cityName}` : ''}. Traditional local architecture, family photos, comfortable living space. Warm, authentic atmosphere with cultural touches.`
  };
  
  const normalizedType = accommodationType?.toLowerCase() || '';
  let basePrompt = accommodationPrompts[normalizedType];
  
  if (!basePrompt) {
    basePrompt = `Interior shot of a stylish ${accommodationType || 'accommodation'}${cityName ? ` in ${cityName}` : ''}. Large windows with a view. Modern rustic decor, natural materials, wood and stone, indoor plants. Soft natural light streaming in, inviting and productive atmosphere.`;
  }
  
  return `${basePrompt} ${MASTER_STYLE_SUFFIX}`;
}

/**
 * Generate a culture/history prompt
 */
export function getCulturePrompt(context: PromptContext): string {
  const { cityName, country, customContext } = context;
  
  const basePrompt = `A close-up, detailed shot of authentic local culture${cityName ? ` in ${cityName}` : ''}${country ? `, ${country}` : ''}. Rich textures and details. Background slightly blurred to emphasize the subject. Authentic local culture, storytelling through details, warm and inviting colors. ${customContext || ''}`;
  
  return `${basePrompt} ${MASTER_STYLE_SUFFIX}`;
}

/**
 * Generate a highlight prompt (for specific places/attractions)
 */
export function getHighlightPrompt(context: PromptContext): string {
  const { cityName, customContext } = context;
  
  const basePrompt = `A stunning detailed shot of ${customContext || 'a key attraction'}${cityName ? ` in ${cityName}` : ''}. Capturing the unique character and atmosphere. Rich textures, authentic details, inviting composition.`;
  
  return `${basePrompt} ${MASTER_STYLE_SUFFIX}`;
}

/**
 * Main function to get prompt based on category
 */
export function getPromptForCategory(
  category: ImageCategory,
  context: PromptContext
): string {
  switch (category) {
    case 'city':
      return getCityPrompt(context);
    case 'region':
      return getRegionPrompt(context);
    case 'activity':
      return getActivityPrompt(context);
    case 'accommodation':
      return getAccommodationPrompt(context);
    case 'culture':
      return getCulturePrompt(context);
    case 'highlight':
      return getHighlightPrompt(context);
    default:
      return getCityPrompt(context);
  }
}







