'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getGuidesByCategory, type GuideMetadata } from '@/lib/guides';

const guideIcons: Record<string, React.ReactNode> = {
  notion: (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#191919]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    </div>
  ),
  'claude-cowork': (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#D97757]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
      </svg>
    </div>
  ),
  'close-crm': (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1A1A2E]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.1.31.03.66-.25 1.02l-2.2 2.2z" />
      </svg>
    </div>
  ),
  'account-review-sop': (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F4C35]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    </div>
  ),
  'client-onboarding-sop': (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F4C35]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </div>
  ),
  'campaign-optimization-sop': (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F4C35]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
      </svg>
    </div>
  ),
  'right-pricing-sop': (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F4C35]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    </div>
  ),
  'sales-demo-sop': (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F4C35]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
      </svg>
    </div>
  ),
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function GuideCard({ guide, buttonLabel }: { guide: GuideMetadata; buttonLabel: string }) {
  return (
    <Card interactive className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between">
        {guideIcons[guide.slug] ?? (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#666">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
            </svg>
          </div>
        )}
        <Badge variant="primary">{guide.difficulty}</Badge>
      </div>

      <h2 className="mb-2 text-xl font-bold text-text">
        {guide.title}
      </h2>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-text-muted">
        {guide.description}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {guide.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="mb-5 flex gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {guide.chapters} {guide.category === 'sop' ? 'sections' : 'chapters'}
        </span>
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {guide.estimatedTime}
        </span>
      </div>

      <Button href={`/guides/${guide.slug}`} className="w-full">
        {buttonLabel}
      </Button>
    </Card>
  );
}

export default function Home() {
  // Reset all guide progress when the user returns to the homepage
  useEffect(() => {
    for (const guide of guides) {
      localStorage.removeItem(`goal-guide-progress-${guide.slug}`);
    }
  }, []);
  const softwareGuides = getGuidesByCategory('guide');
  const sops = getGuidesByCategory('sop');

  return (
    <>
      {/* Hero */}
      <section className="pb-16 pt-20 md:pb-24 md:pt-28">
        <Container>
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.p
              variants={fadeUp}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-primary"
            >
              GOAL Software Guides
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight text-text md:text-5xl"
            >
              Interactive Guides for Goal Processes
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg leading-relaxed text-text-muted"
            >
              Interactive guides and standard operating procedures to help you
              master every part of the GOAL platform.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Software Guides */}
      <section className="pb-16">
        <Container>
          <motion.div
            className="mx-auto mb-10 max-w-2xl text-center"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-bold text-text md:text-3xl"
            >
              Software Guides
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-2 text-sm text-text-muted"
            >
              Step-by-step training for the tools your team uses every day.
            </motion.p>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
            }}
          >
            {softwareGuides.map((guide) => (
              <motion.div key={guide.slug} variants={fadeUp}>
                <GuideCard guide={guide} buttonLabel="Start Guide" />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-6">
        <hr className="border-border" />
      </div>

      {/* Standard Operating Procedures */}
      <section className="pb-24 pt-16">
        <Container>
          <motion.div
            className="mx-auto mb-10 max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-bold text-text md:text-3xl"
            >
              Standard Operating Procedures
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-2 text-sm text-text-muted"
            >
              Repeatable, data-driven processes for account management and campaign operations.
            </motion.p>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {sops.map((sop) => (
              <motion.div key={sop.slug} variants={fadeUp}>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-[#0F4C35]" />
                  <GuideCard guide={sop} buttonLabel="View SOP" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>
    </>
  );
}
