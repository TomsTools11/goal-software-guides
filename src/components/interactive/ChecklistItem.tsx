'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';

interface ChecklistItemProps {
  id: string;
  children: React.ReactNode;
}

let listeners: Array<() => void> = [];
function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function ChecklistItem({ id, children }: ChecklistItemProps) {
  const storageKey = `goal-checklist-${id}`;

  const checked = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(storageKey) === 'true';
      } catch {
        return false;
      }
    },
    () => false
  );

  const toggle = useCallback(() => {
    const next = !checked;
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      // ignore
    }
    emitChange();
  }, [checked, storageKey]);

  return (
    <label className="my-2 flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-background-soft">
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
