import { notFound } from 'next/navigation';
import { getGuideBySlug, getAllSlugs } from '@/lib/guides';
import { GuideLayoutWrapper } from './GuideLayoutWrapper';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} — GOAL Software Guides`,
    description: guide.description,
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  let Content: React.ComponentType;
  try {
    const mod = await import(`@/content/${slug}/index.mdx`);
    Content = mod.default;
  } catch {
    notFound();
  }

  return (
    <GuideLayoutWrapper guide={guide}>
      <Content />
    </GuideLayoutWrapper>
  );
}
