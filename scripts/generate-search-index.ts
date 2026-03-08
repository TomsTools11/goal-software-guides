import * as fs from 'fs';
import * as path from 'path';

interface GuideMetadata {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  categories: string[];
}

interface SearchEntry {
  guideSlug: string;
  guideTitle: string;
  guideDescription: string;
  sectionHeading: string;
  sectionAnchor: string;
  content: string;
  difficulty: string;
  categories: string[];
}

// Must match the slugify in src/components/mdx/MDXComponents.tsx
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function stripJsx(text: string): string {
  // Extract text from title="..." and content: "..." props
  const extracted: string[] = [];

  // Pull title props
  const titleMatches = text.matchAll(/title="([^"]+)"/g);
  for (const m of titleMatches) extracted.push(m[1]);

  // Pull content props from StepByStep steps
  const contentMatches = text.matchAll(/content:\s*"([^"]+)"/g);
  for (const m of contentMatches) extracted.push(m[1]);

  // Pull content from template/content/label string props
  const genericProps = text.matchAll(/(?:label|template|question|placeholder|heading)\s*=\s*"([^"]+)"/g);
  for (const m of genericProps) extracted.push(m[1]);

  // Strip JSX tags but keep text children
  let cleaned = text
    .replace(/<[^>]+>/g, ' ')  // Remove JSX/HTML tags
    .replace(/\{[^}]*\}/g, ' ') // Remove JSX expressions
    .replace(/import\s+.*?from\s+['"].*?['"]\s*;?/g, '') // Remove imports
    .replace(/export\s+(default\s+)?/g, '') // Remove exports
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, (match) => match.slice(1, -1)) // Unwrap inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Markdown links → text
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // Bold/italic → text
    .replace(/#{1,6}\s*/g, '') // Remove heading markers (already split)
    .replace(/\s+/g, ' ')
    .trim();

  if (extracted.length > 0) {
    cleaned = cleaned + ' ' + extracted.join(' ');
  }

  return cleaned;
}

function parseGuides(): SearchEntry[] {
  // Read guides metadata directly from the file to avoid ESM/import issues
  const guidesPath = path.join(__dirname, '..', 'src', 'lib', 'guides.ts');
  const guidesSource = fs.readFileSync(guidesPath, 'utf-8');

  // Extract guide objects using regex
  const guides: GuideMetadata[] = [];
  const guideBlockRegex = /\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*(?:'([^']*(?:\\.[^']*)*)'|"([^"]*(?:\\.[^"]*)*)"),[\s\S]*?difficulty:\s*'([^']+)',\s*categories:\s*\[([^\]]+)\]/g;

  let match;
  while ((match = guideBlockRegex.exec(guidesSource)) !== null) {
    guides.push({
      slug: match[1],
      title: match[2],
      description: (match[3] || match[4] || '').replace(/\\'/g, "'"),
      difficulty: match[5],
      categories: match[6].replace(/['\s]/g, '').split(','),
    });
  }

  const contentDir = path.join(__dirname, '..', 'src', 'content');
  const entries: SearchEntry[] = [];

  for (const guide of guides) {
    const mdxPath = path.join(contentDir, guide.slug, 'index.mdx');
    if (!fs.existsSync(mdxPath)) {
      console.warn(`Skipping ${guide.slug}: no MDX file found`);
      continue;
    }

    const raw = fs.readFileSync(mdxPath, 'utf-8');

    // Split on ## headings
    const sections = raw.split(/^## /m);

    // First section is the intro (before any ## heading)
    const intro = sections[0];
    if (intro.trim()) {
      entries.push({
        guideSlug: guide.slug,
        guideTitle: guide.title,
        guideDescription: guide.description,
        sectionHeading: 'Introduction',
        sectionAnchor: '',
        content: stripJsx(intro).slice(0, 1000),
        difficulty: guide.difficulty,
        categories: guide.categories,
      });
    }

    // Remaining sections
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const newlineIdx = section.indexOf('\n');
      const heading = newlineIdx !== -1 ? section.slice(0, newlineIdx).trim() : section.trim();
      const body = newlineIdx !== -1 ? section.slice(newlineIdx) : '';

      entries.push({
        guideSlug: guide.slug,
        guideTitle: guide.title,
        guideDescription: guide.description,
        sectionHeading: heading,
        sectionAnchor: slugify(heading),
        content: stripJsx(body).slice(0, 1000),
        difficulty: guide.difficulty,
        categories: guide.categories,
      });
    }
  }

  return entries;
}

const entries = parseGuides();
const outPath = path.join(__dirname, '..', 'public', 'search-index.json');
fs.writeFileSync(outPath, JSON.stringify(entries, null, 0));
console.log(`Generated search index: ${entries.length} entries → ${outPath}`);
