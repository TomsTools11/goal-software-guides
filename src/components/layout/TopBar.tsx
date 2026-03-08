'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { CommandPalette } from './CommandPalette';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { clerkUser } = useAuth();

  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? '';
  const initial = email?.[0]?.toUpperCase() ?? '?';

  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-surface px-4 lg:px-6">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-background-soft lg:hidden"
          aria-label="Open sidebar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="8" x2="21" y2="8" />
            <line x1="3" y1="16" x2="21" y2="16" />
          </svg>
        </button>

        {/* Search trigger — opens CommandPalette */}
        <div className="flex flex-1 items-center">
          <button
            type="button"
            onClick={() => {
              // Dispatch Cmd+K to open the palette
              document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              );
            }}
            className="flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-background-soft px-3 text-sm text-text-muted/60 transition-colors hover:border-primary/40 hover:text-text-muted"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="flex-1 text-left">Search guides...</span>
            <kbd className="hidden select-none items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-muted sm:inline-flex">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-background-soft hover:text-text"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* User menu */}
        <Link
          href="/account"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-opacity hover:opacity-80"
          title={email || 'Account'}
        >
          {initial}
        </Link>
      </div>

      {/* Command palette (rendered as portal-like fixed overlay) */}
      <CommandPalette />
    </>
  );
}
