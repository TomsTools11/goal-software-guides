'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type DemoType = 'notion-sidebar' | 'notion-database' | 'cowork-task' | 'cowork-setup';

interface AnimatedDemoProps {
  type: DemoType;
  title?: string;
}

function NotionSidebarDemo() {
  const [step, setStep] = useState(0);
  const pages = [
    { name: 'Getting Started', indent: 0, delay: 0.3 },
    { name: 'Team Wiki', indent: 0, delay: 0.6 },
    { name: 'Engineering', indent: 1, delay: 0.9 },
    { name: 'Design', indent: 1, delay: 1.2 },
    { name: 'Project Tracker', indent: 0, delay: 1.5 },
    { name: 'Sprint Board', indent: 1, delay: 1.8 },
    { name: 'Meeting Notes', indent: 0, delay: 2.1 },
  ];

  useEffect(() => {
    if (step < pages.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 400);
      return () => clearTimeout(t);
    }
  }, [step, pages.length]);

  return (
    <div className="space-y-1 p-4">
      {pages.slice(0, step).map((page, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-black/5"
          style={{ paddingLeft: `${8 + page.indent * 16}px` }}
        >
          <span className="text-[10px] opacity-60">{page.indent > 0 ? '📄' : '📁'}</span>
          <span className="text-gray-700">{page.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

function NotionDatabaseDemo() {
  const [view, setView] = useState<'table' | 'board' | 'gallery'>('table');
  const views = ['table', 'board', 'gallery'] as const;

  useEffect(() => {
    const idx = views.indexOf(view);
    const t = setTimeout(
      () => setView(views[(idx + 1) % views.length]),
      2000
    );
    return () => clearTimeout(t);
  }, [view]);

  return (
    <div className="p-4">
      <div className="mb-3 flex gap-2">
        {views.map((v) => (
          <span
            key={v}
            className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
              v === view ? 'bg-gray-200 text-gray-800' : 'text-gray-400'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </span>
        ))}
      </div>
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {view === 'table' && (
          <div className="space-y-1">
            {['Task Alpha', 'Task Beta', 'Task Gamma'].map((name, i) => (
              <div key={i} className="flex items-center gap-3 rounded bg-gray-100 px-2 py-1.5 text-[10px] text-gray-700">
                <span className="w-20 truncate">{name}</span>
                <span className={`rounded px-1.5 py-0.5 text-[9px] ${i === 0 ? 'bg-green-100 text-green-700' : i === 1 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {i === 0 ? 'Done' : i === 1 ? 'In Progress' : 'To Do'}
                </span>
              </div>
            ))}
          </div>
        )}
        {view === 'board' && (
          <div className="flex gap-2">
            {['To Do', 'In Progress', 'Done'].map((col) => (
              <div key={col} className="flex-1 rounded bg-gray-100 p-1.5">
                <p className="mb-1 text-[9px] font-medium text-gray-500">{col}</p>
                <div className="rounded bg-white p-1.5 text-[9px] text-gray-700 shadow-sm">Task</div>
              </div>
            ))}
          </div>
        )}
        {view === 'gallery' && (
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded bg-gray-100 p-2 text-center text-[9px] text-gray-700">
                Card {n}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function CoworkTaskDemo() {
  const [phase, setPhase] = useState(0);
  const phases = ['Analyzing...', 'Breaking into subtasks', 'Running tasks in parallel', 'Combining results', 'Complete ✓'];

  useEffect(() => {
    if (phase < phases.length - 1) {
      const t = setTimeout(() => setPhase((p) => p + 1), 1200);
      return () => clearTimeout(t);
    }
  }, [phase, phases.length]);

  return (
    <div className="space-y-2 p-4">
      {phases.slice(0, phase + 1).map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-[11px]"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${i === phase && i < phases.length - 1 ? 'animate-pulse bg-blue-400' : i <= phase ? 'bg-green-400' : 'bg-white/20'}`} />
          <span className={i <= phase ? 'text-white/90' : 'text-white/40'}>{p}</span>
        </motion.div>
      ))}
    </div>
  );
}

function CoworkSetupDemo() {
  const [mode, setMode] = useState<'chat' | 'cowork'>('chat');

  useEffect(() => {
    const t = setTimeout(() => setMode(mode === 'chat' ? 'cowork' : 'chat'), 2500);
    return () => clearTimeout(t);
  }, [mode]);

  return (
    <div className="p-4">
      <motion.div
        key={mode}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg bg-white/10 p-3"
      >
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${mode === 'cowork' ? 'bg-orange-500/30 text-orange-300' : 'bg-blue-500/30 text-blue-300'}`}>
            {mode === 'chat' ? 'Chat Mode' : 'Cowork Mode'}
          </span>
        </div>
        <p className="text-[10px] text-white/70">
          {mode === 'chat'
            ? 'Quick Q&A, brainstorming, one-shot tasks...'
            : 'Multi-step projects, file creation, autonomous execution...'}
        </p>
      </motion.div>
    </div>
  );
}

const demos: Record<DemoType, React.ComponentType> = {
  'notion-sidebar': NotionSidebarDemo,
  'notion-database': NotionDatabaseDemo,
  'cowork-task': CoworkTaskDemo,
  'cowork-setup': CoworkSetupDemo,
};

const defaultTitles: Record<DemoType, string> = {
  'notion-sidebar': 'Notion Sidebar Navigation',
  'notion-database': 'Database View Switching',
  'cowork-task': 'Cowork Task Execution',
  'cowork-setup': 'Chat → Cowork Transition',
};

export function AnimatedDemo({ type, title }: AnimatedDemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [playing, setPlaying] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const DemoComponent = demos[type];
  const isNotion = type.startsWith('notion-');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isInView && !prefersReduced) setPlaying(true);
  }, [isInView, prefersReduced]);

  return (
    <div ref={ref} className={`my-6 overflow-hidden rounded-xl border shadow-lg ${isNotion ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#1e1e2e]'}`}>
      {/* Browser chrome */}
      <div className={`flex items-center gap-2 border-b px-4 py-2.5 ${isNotion ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-[#181825]'}`}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <span className={`ml-3 flex-1 text-center text-[10px] ${isNotion ? 'text-gray-400' : 'text-white/40'}`}>
          {title ?? defaultTitles[type]}
        </span>
        <button
          type="button"
          onClick={() => setPlaying(false)}
          className={`min-h-[44px] min-w-[44px] px-2 text-[10px] transition-colors ${isNotion ? 'text-gray-300 hover:text-gray-500' : 'text-white/30 hover:text-white/60'}`}
          aria-label="Replay animation"
        >
          ↻ Replay
        </button>
      </div>

      {/* Demo area */}
      <div className="min-h-[140px]">
        {playing ? (
          <DemoComponent />
        ) : (
          <div className="flex min-h-[140px] items-center justify-center">
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className={`min-h-[44px] rounded-full px-6 py-3 text-xs transition-colors ${isNotion ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              ▶ Play
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
