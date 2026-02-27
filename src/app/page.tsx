'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { guides } from '@/lib/guides';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
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
                    <Image
                      src={guide.icon}
                      alt=""
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
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
