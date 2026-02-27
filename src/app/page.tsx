'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { guides } from '@/lib/guides';

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
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  // Reset all guide progress when the user returns to the homepage
  useEffect(() => {
    for (const guide of guides) {
      localStorage.removeItem(`goal-guide-progress-${guide.slug}`);
    }
  }, []);

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
              Learn the tools that power your workflow
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg leading-relaxed text-text-muted"
            >
              Interactive, step-by-step guides to help you get the most out of
              Notion, Claude Cowork, and more.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Guide Cards */}
      <section className="pb-24">
        <Container>
          <motion.div
            className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
            }}
          >
            {guides.map((guide) => (
              <motion.div key={guide.slug} variants={fadeUp}>
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
                      {guide.chapters} chapters
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
                    Start Guide
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>
    </>
  );
}
