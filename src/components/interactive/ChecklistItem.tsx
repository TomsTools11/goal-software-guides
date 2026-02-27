'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChecklistItemProps {
  id: string;
  children: React.ReactNode;
}

export function ChecklistItem({ id, children }: ChecklistItemProps) {
  const storageKey = `goal-checklist-${id}`;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      setChecked(localStorage.getItem(storageKey) === 'true');
    } catch {
      // ignore
    }
  }, [storageKey]);

  function toggle() {
    const next = !checked;
    setChecked(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      // ignore
    }
  }

  return (
    <label className="my-2 flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-background-soft">
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={toggle}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded border-2 border-border transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300 peer-focus-visible:ring-offset-2" />
        {checked && (
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="relative z-10"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
      </span>
      <span
        className={`text-sm leading-relaxed transition-colors ${
          checked ? 'text-text-muted line-through' : 'text-text'
        }`}
      >
        {children}
      </span>
    </label>
  );
}
