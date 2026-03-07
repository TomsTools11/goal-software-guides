'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BrowserChrome } from './BrowserChrome';

interface ScriptLine {
  speaker: string;
  type: 'agent' | 'prospect' | 'narrator';
  text: string;
  highlight?: boolean;
}

interface ScriptBlockProps {
  title?: string;
  lines: ScriptLine[];
}

const speakerStyles: Record<ScriptLine['type'], string> = {
  agent: 'bg-blue-500/20 text-blue-300',
  prospect: 'bg-white/10 text-white/60',
  narrator: '',
};

export function ScriptBlock({ title = 'Script', lines }: ScriptBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="my-6">
      <BrowserChrome title={title}>
        <div className="space-y-1 p-4 sm:p-5">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className={`flex gap-3 rounded-lg px-3 py-2.5 ${
                line.highlight ? 'border-l-2 border-primary bg-primary/5' : ''
              }`}
            >
              {line.type === 'narrator' ? (
                <p className="text-xs italic leading-relaxed text-white/40">
                  {line.text}
                </p>
              ) : (
                <>
                  <span
                    className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${speakerStyles[line.type]}`}
                  >
                    {line.speaker}
                  </span>
                  <p className="text-sm leading-relaxed text-white/80">
                    {line.text}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </BrowserChrome>
    </div>
  );
}
