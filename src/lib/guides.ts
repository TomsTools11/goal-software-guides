export interface GuideMetadata {
  slug: string;
  title: string;
  description: string;
  icon: string;
  chapters: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  category: 'guide' | 'sop';
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
    category: 'guide',
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
    category: 'guide',
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
    category: 'guide',
  },
  {
    slug: 'account-review-sop',
    title: 'Account Review SOP',
    description:
      'Standard procedure for conducting monthly and quarterly account reviews — KPIs, 4-phase review cycle, escalation protocol, and key terminology.',
    icon: '',
    chapters: 5,
    estimatedTime: '15 min',
    difficulty: 'Intermediate',
    tags: ['Account Management', 'KPIs', 'Reviews'],
    category: 'sop',
  },
  {
    slug: 'client-onboarding-sop',
    title: 'Client Onboarding SOP',
    description:
      'Repeatable onboarding process from signup through 30-day post-launch review — pre-onboarding, meeting execution, and activation.',
    icon: '',
    chapters: 4,
    estimatedTime: '20 min',
    difficulty: 'Beginner',
    tags: ['Onboarding', 'Client Success', 'Setup'],
    category: 'sop',
  },
  {
    slug: 'campaign-optimization-sop',
    title: 'Campaign Optimization SOP',
    description:
      'Data-driven campaign optimization across 5 pillars — disposition integration, budget controls, targeting, bid modifiers, and source attribution.',
    icon: '',
    chapters: 8,
    estimatedTime: '25 min',
    difficulty: 'Advanced',
    tags: ['Optimization', 'Campaigns', 'Analytics'],
    category: 'sop',
  },
  {
    slug: 'right-pricing-sop',
    title: 'Right Pricing SOP',
    description:
      '6-step bid management procedure for achieving target CPA through base bid strategy, source modifiers, and continuous monitoring.',
    icon: '',
    chapters: 5,
    estimatedTime: '15 min',
    difficulty: 'Intermediate',
    tags: ['Pricing', 'Bidding', 'CPA'],
    category: 'sop',
  },
  {
    slug: 'sales-demo-sop',
    title: 'GOAL Sales Demo SOP',
    description:
      'Standardized sales conversation from discovery through platform demo to close — includes scorecard, financial terms, and post-demo workflow.',
    icon: '',
    chapters: 7,
    estimatedTime: '20 min',
    difficulty: 'Intermediate',
    tags: ['Sales', 'Demo', 'Closing'],
    category: 'sop',
  },
];

export function getGuideBySlug(slug: string): GuideMetadata | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesByCategory(category: 'guide' | 'sop'): GuideMetadata[] {
  return guides.filter((g) => g.category === category);
}

export function getAllSlugs(): string[] {
  return guides.map((g) => g.slug);
}
