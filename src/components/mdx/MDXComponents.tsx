import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import { Accordion } from '@/components/interactive/Accordion';
import { StepByStep } from '@/components/interactive/StepByStep';
import { TipCallout } from '@/components/interactive/TipCallout';
import { InfoCard } from '@/components/interactive/InfoCard';
import { AnimatedDemo } from '@/components/interactive/AnimatedDemo';
import { ChecklistItem } from '@/components/interactive/ChecklistItem';
import { Screenshot } from '@/components/interactive/Screenshot';
import { Quiz } from '@/components/interactive/Quiz';
import { DataTable } from '@/components/interactive/DataTable';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getTextContent(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return getTextContent((children as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

export const mdxComponents: MDXComponents = {
  // Heading overrides — scroll-mt to clear sticky header, auto-generate IDs
  h1: (props) => (
    <h1
      className="mb-6 text-3xl font-bold leading-tight text-text md:text-4xl"
      {...props}
    />
  ),
  h2: (props) => {
    const id = props.id || slugify(getTextContent(props.children));
    return (
      <h2
        id={id}
        className="mb-4 mt-12 scroll-mt-24 text-2xl font-bold leading-snug text-text"
        {...props}
      />
    );
  },
  h3: (props) => {
    const id = props.id || slugify(getTextContent(props.children));
    return (
      <h3
        id={id}
        className="mb-3 mt-8 scroll-mt-24 text-xl font-semibold leading-snug text-text"
        {...props}
      />
    );
  },

  // Text
  p: (props) => (
    <p className="mb-4 text-base leading-relaxed text-text-muted" {...props} />
  ),

  // Lists
  ul: (props) => (
    <ul className="mb-4 ml-5 list-disc space-y-1 text-base leading-relaxed text-text-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 ml-5 list-decimal space-y-1 text-base leading-relaxed text-text-muted" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,

  // Blockquote
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-4 border-primary-200 pl-4 italic text-text-muted"
      {...props}
    />
  ),

  // Code
  code: (props) => (
    <code
      className="rounded bg-background-soft px-1.5 py-0.5 font-mono text-sm text-primary-700"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg bg-[#1e1e2e] p-4 font-mono text-sm leading-relaxed text-white/90"
      {...props}
    />
  ),

  // Links
  a: (props) => (
    <a
      className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:text-primary-700 hover:decoration-primary"
      {...props}
    />
  ),

  // Horizontal rule
  hr: () => <hr className="my-8 border-border" />,

  // Tables
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props) => (
    <thead className="bg-background-soft" {...props} />
  ),
  tr: (props) => (
    <tr className="border-b border-border last:border-b-0" {...props} />
  ),
  th: (props) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text"
      {...props}
    />
  ),
  td: (props) => (
    <td className="px-4 py-3 text-text-muted" {...props} />
  ),

  // Strong / em
  strong: (props) => <strong className="font-semibold text-text" {...props} />,

  // Custom interactive components — available in MDX
  Accordion,
  StepByStep,
  TipCallout,
  InfoCard,
  AnimatedDemo,
  ChecklistItem,
  Screenshot,
  Quiz,
  DataTable,
};
