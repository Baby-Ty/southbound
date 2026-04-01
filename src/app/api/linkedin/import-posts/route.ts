import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * GET /api/linkedin/import-posts
 *
 * Reads markdown post files from the South Bound content/linkedin directory
 * and returns them as structured post objects.
 *
 * The South Bound workspace is expected to be at ../South Bound relative to
 * the Next.js project root (process.cwd()).
 *
 * Override with SOUTHBOUND_CONTENT_PATH env var if needed.
 */

export type PostType = 'city-series' | 'lifestyle' | 'practical' | 'inspiration' | 'reel';
export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface ImportedPost {
  id: string;
  title: string;
  content: string;
  type: PostType;
  city?: string;
  day?: number;
  hashtags: string[];
  mediaFiles: { name: string; url?: string }[];
  status: PostStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  timezone: string;
  createdAt: string;
  series: string;
  visualNote?: string;
  cta?: string;
  source: 'imported';
}

/**
 * Infer type from the Type: field in the markdown
 */
function inferType(typeLine: string): PostType {
  const lower = typeLine.toLowerCase();
  if (lower.includes('city series') || lower.includes('city-series') || lower.includes('day ')) return 'city-series';
  if (lower.includes('lifestyle')) return 'lifestyle';
  if (lower.includes('practical') || lower.includes('myth') || lower.includes('visa') || lower.includes('income')) return 'practical';
  if (lower.includes('reel')) return 'reel';
  return 'inspiration';
}

/**
 * Infer city series day from the type string
 */
function inferDay(typeLine: string): number | undefined {
  const match = typeLine.match(/day\s*(\d)/i);
  if (match) return parseInt(match[1], 10);
  return undefined;
}

/**
 * Infer city from the title or type line
 */
function inferCity(title: string, typeLine: string, filename: string): string | undefined {
  const cityPatterns = [
    'bali', 'bangkok', 'chiang mai', 'da nang', 'hanoi', 'ho chi minh',
    'mexico city', 'buenos aires', 'medellín', 'medellin', 'rio', 'lima',
    'istanbul', 'tbilisi', 'budapest', 'split', 'lisbon',
    'canggu', 'ubud', 'seminyak',
  ];
  const combined = `${title} ${typeLine} ${filename}`.toLowerCase();
  for (const city of cityPatterns) {
    if (combined.includes(city)) {
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }
  return undefined;
}

/**
 * Parse a markdown post file into a structured post object
 */
function parseMarkdownPost(
  markdown: string,
  filename: string,
  series: string,
  index: number
): ImportedPost | null {
  try {
    const lines = markdown.split('\n');

    // Extract title from first # heading
    const titleLine = lines.find((l) => l.startsWith('# '));
    const rawTitle = titleLine ? titleLine.replace(/^#\s+/, '').replace(/^Post \d+\s*[—–-]+\s*/i, '').trim() : filename.replace('.md', '');

    // Extract metadata fields
    const getMeta = (key: string) => {
      const line = lines.find((l) => l.toLowerCase().startsWith(key.toLowerCase() + ':'));
      return line ? line.replace(new RegExp(`^${key}:\\s*`, 'i'), '').trim() : '';
    };

    const typeLine = getMeta('Type');
    const type = inferType(typeLine);
    const day = type === 'city-series' ? inferDay(typeLine) : undefined;
    const city = inferCity(rawTitle, typeLine, filename);

    // Extract POST COPY section
    const postCopyStart = markdown.indexOf('## POST COPY');
    const altCopyStart = markdown.indexOf('## Post Copy');
    const copyStart = postCopyStart !== -1 ? postCopyStart : altCopyStart;

    let content = '';
    if (copyStart !== -1) {
      // Get everything after ## POST COPY
      const afterHeader = markdown.slice(copyStart).replace(/^##[^\n]*\n/, '');
      // Remove trailing South Bound signature line
      const trimmed = afterHeader
        .replace(/\n---\n[\s\S]*$/, '') // remove trailing ---
        .replace(/\n\*South Bound[^*]*\*\s*$/, '') // remove signature
        .trim();
      content = trimmed;
    } else {
      // Fallback: use everything after the metadata block
      const metaEnd = markdown.indexOf('\n---\n');
      content = metaEnd !== -1 ? markdown.slice(metaEnd + 5).trim() : markdown.trim();
    }

    // Extract hashtags from content if present
    const hashtagMatches = content.match(/#[a-zA-Z][a-zA-Z0-9]*/g) || [];
    // Remove hashtags from main content
    const contentWithoutTags = content.replace(/\n+#[a-zA-Z][\w\s#]*/g, '').trim();

    // Extract visual note
    const visualNoteMatch = markdown.match(/\*\*Visual note\*\*:([^\n]+)/i) ||
                             markdown.match(/Visual Note:([^\n]+)/i);
    const visualNote = visualNoteMatch ? visualNoteMatch[1].trim() : undefined;

    // Generate a stable ID from series + filename
    const id = `imported-${series}-${filename.replace('.md', '').replace(/[^a-z0-9]/gi, '-')}`;

    return {
      id,
      title: rawTitle,
      content: contentWithoutTags || content,
      type,
      city,
      day,
      hashtags: hashtagMatches.slice(0, 5),
      mediaFiles: [],
      status: 'draft',
      timezone: 'Africa/Johannesburg',
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      series,
      visualNote,
      source: 'imported',
    };
  } catch (err) {
    console.error(`Failed to parse ${filename}:`, err);
    return null;
  }
}

export async function GET() {
  try {
    // Determine the content directory path
    const contentPath =
      process.env.SOUTHBOUND_CONTENT_PATH ||
      path.join(process.cwd(), '..', 'South Bound', 'content', 'linkedin');

    if (!fs.existsSync(contentPath)) {
      // Return empty array if the directory doesn't exist
      return NextResponse.json({ posts: [], error: `Content directory not found: ${contentPath}` });
    }

    const posts: ImportedPost[] = [];
    let globalIndex = 0;

    // Read series directories
    const seriesDirs = fs.readdirSync(contentPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const seriesName of seriesDirs) {
      const seriesPath = path.join(contentPath, seriesName);
      const files = fs.readdirSync(seriesPath)
        .filter((f) => f.endsWith('.md') && !f.startsWith('calendar') && !f.startsWith('series-overview') && !f.startsWith('.'));

      // Sort by filename (preserves the numbering)
      files.sort();

      for (const file of files) {
        const filePath = path.join(seriesPath, file);
        const markdown = fs.readFileSync(filePath, 'utf-8');
        const post = parseMarkdownPost(markdown, file, seriesName, globalIndex);
        if (post) {
          posts.push(post);
          globalIndex++;
        }
      }
    }

    return NextResponse.json({ posts, count: posts.length });
  } catch (error: any) {
    console.error('[Import Posts] Error:', error);
    return NextResponse.json(
      { posts: [], error: error.message },
      { status: 500 }
    );
  }
}
