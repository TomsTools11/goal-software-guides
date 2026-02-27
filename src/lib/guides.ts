export interface GuideMetadata {
  slug: string;
  title: string;
  description: string;
  icon: string;
  chapters: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export const guides: GuideMetadata[] = [
  {
    slug: 'notion',
    title: 'Mastering Notion',
    description:
      'Learn workspace architecture, databases, views, automations, and integrations.',
    icon: '/images/guides/notion-icon.svg',
    chapters: 8,
    estimatedTime: '30 min',
    difficulty: 'Beginner',
    tags: ['Productivity', 'Workspace', 'Databases'],
  },
  {
    slug: 'claude-cowork',
    title: 'Getting Started with Claude Cowork',
    description:
      'Set up Claude Cowork and learn real-world use cases for multi-step task automation.',
    icon: '/images/guides/claude-icon.svg',
    chapters: 6,
    estimatedTime: '20 min',
    difficulty: 'Beginner',
    tags: ['AI', 'Automation', 'Productivity'],
  },
  {
    slug: 'close-crm',
    title: 'Mastering Close CRM',
    description:
      'Configure your Close environment, capture high-signal leads, manage opportunities, and optimize your sales pipeline.',
    icon: '/images/guides/close-crm-icon.svg',
    chapters: 7,
    estimatedTime: '25 min',
    difficulty: 'Intermediate',
    tags: ['CRM', 'Sales', 'Pipeline'],
  },
];

export function getGuideBySlug(slug: string): GuideMetadata | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getAllSlugs(): string[] {
  return guides.map((g) => g.slug);
}
