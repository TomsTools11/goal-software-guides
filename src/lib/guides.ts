export interface GuideMetadata {
  slug: string;
  title: string;
  description: string;
  chapters: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'guide' | 'sop';
}

export const guides: GuideMetadata[] = [
  {
    slug: 'notion',
    title: 'Mastering Notion',
    description:
      'Learn workspace architecture, databases, views, automations, and integrations.',
    chapters: 8,
    estimatedTime: '30 min',
    difficulty: 'Beginner',
    category: 'guide',
  },
  {
    slug: 'claude-cowork',
    title: 'Getting Started with Claude Cowork',
    description:
      'Set up Claude Cowork and learn real-world use cases for multi-step task automation.',
    chapters: 6,
    estimatedTime: '20 min',
    difficulty: 'Beginner',
    category: 'guide',
  },
  {
    slug: 'close-crm',
    title: 'Mastering Close CRM',
    description:
      'Configure your Close environment, capture high-signal leads, manage opportunities, and optimize your sales pipeline.',
    chapters: 7,
    estimatedTime: '25 min',
    difficulty: 'Intermediate',
    category: 'guide',
  },
  {
    slug: 'account-review-sop',
    title: 'Account Review SOP',
    description:
      'Standard procedure for conducting monthly and quarterly account reviews — KPIs, 4-phase review cycle, escalation protocol, and key terminology.',
    chapters: 5,
    estimatedTime: '15 min',
    difficulty: 'Intermediate',
    category: 'sop',
  },
  {
    slug: 'client-onboarding-sop',
    title: 'Client Onboarding SOP',
    description:
      'Repeatable onboarding process from signup through 30-day post-launch review — pre-onboarding, meeting execution, and activation.',
    chapters: 4,
    estimatedTime: '20 min',
    difficulty: 'Beginner',
    category: 'sop',
  },
  {
    slug: 'campaign-optimization-sop',
    title: 'Campaign Optimization SOP',
    description:
      'Data-driven campaign optimization across 5 pillars — disposition integration, budget controls, targeting, bid modifiers, and source attribution.',
    chapters: 8,
    estimatedTime: '25 min',
    difficulty: 'Advanced',
    category: 'sop',
  },
  {
    slug: 'right-pricing-sop',
    title: 'Right Pricing SOP',
    description:
      '6-step bid management procedure for achieving target CPA through base bid strategy, source modifiers, and continuous monitoring.',
    chapters: 5,
    estimatedTime: '15 min',
    difficulty: 'Intermediate',
    category: 'sop',
  },
  {
    slug: 'sales-demo-sop',
    title: 'GOAL Sales Demo SOP',
    description:
      'Standardized sales conversation from discovery through platform demo to close — includes scorecard, financial terms, and post-demo workflow.',
    chapters: 7,
    estimatedTime: '20 min',
    difficulty: 'Intermediate',
    category: 'sop',
  },
  {
    slug: 'disposition-data-import-sop',
    title: 'Disposition Data Import SOP',
    description:
      'End-to-end process for importing client disposition data into GOAL — file preparation, bulk import workflow, error resolution, and CPH benchmarks.',
    chapters: 11,
    estimatedTime: '20 min',
    difficulty: 'Intermediate',
    category: 'sop',
  },
  {
    slug: 'sales-discovery-process',
    title: 'GOAL Sales Discovery Process',
    description:
      'Master consultative discovery for insurance sales — scorecard framework, qualification, deep problem exploration, and demo transition techniques.',
    chapters: 9,
    estimatedTime: '35 min',
    difficulty: 'Intermediate',
    category: 'sop',
  },
  {
    slug: 'setting-expectations-sop',
    title: 'Setting Firm Expectations & Handling Objections',
    description:
      'Build confidence handling the data requirement, 90-day ramp conversation, and the "burned by lead vendors" objection — with case studies and talk tracks.',
    chapters: 8,
    estimatedTime: '30 min',
    difficulty: 'Intermediate',
    category: 'sop',
  },
  {
    slug: 'competition-research',
    title: 'GOAL Competition Research',
    description:
      'Know the competitive landscape — market positioning, competitor strengths and weaknesses, battlecards, objection handling, and landmine questions for every major competitor.',
    chapters: 8,
    estimatedTime: '25 min',
    difficulty: 'Beginner',
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
