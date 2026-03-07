'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplateField {
  label: string;
  placeholder?: string;
}

interface TemplateSection {
  heading: string;
  fields?: TemplateField[];
  bullets?: number;
}

interface CopyableTemplateProps {
  title: string;
  sections: TemplateSection[];
}

function buildCopyText(sections: TemplateSection[]): string {
  return sections
    .map((s) => {
      const lines: string[] = [s.heading];
      if (s.fields) {
        s.fields.forEach((f) => {
          lines.push(`${f.label} ${f.placeholder ?? ''}`);
        });
      }
      if (s.bullets) {
        for (let i = 0; i < s.bullets; i++) {
          lines.push('- ');
        }
      }
      return lines.join('\n');
    })
    .join('\n\n');
}

export function CopyableTemplate({ title, sections }: CopyableTemplateProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = buildCopyText(sections);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Clipboard access denied — ignore silently
    });
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background-soft px-5 py-3">
        <div className="flex items-center gap-2.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span className="text-sm font-semibold text-text">{title}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.svg
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-success"
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </motion.svg>
            )}
          </AnimatePresence>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Template body */}
      <div className="divide-y divide-border/60">
        {sections.map((section, si) => (
          <div key={si} className="px-5 py-4">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {section.heading}
            </p>
            {section.fields && (
              <div className="space-y-2">
                {section.fields.map((field, fi) => (
                  <div key={fi}>
                    {field.placeholder ? (
                      <div>
                        <span className="text-sm font-medium text-text">
                          {field.label}
                        </span>
                        <span className="ml-2 text-sm text-text-muted/80 italic leading-relaxed">
                          {field.placeholder}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="shrink-0 text-sm font-medium text-text">
                          {field.label}
                        </span>
                        <span className="flex-1 border-b border-dashed border-border/80" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {section.bullets && (
              <div className="space-y-2">
                {Array.from({ length: section.bullets }).map((_, bi) => (
                  <div key={bi} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                    <span className="flex-1 border-b border-dashed border-border/80" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
