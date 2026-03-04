'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getGuidesByCategory } from '@/lib/guides';

interface AppSidebarProps {
  onNavigate?: () => void;
}

const softwareGuides = getGuidesByCategory('guide');
const sops = getGuidesByCategory('sop');

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  function navLink(href: string, label: string) {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
          isActive
            ? 'border-l-2 border-primary bg-primary-50 font-semibold text-primary'
            : 'border-l-2 border-transparent text-text-muted hover:bg-background-soft hover:text-text'
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <aside className="flex h-full flex-col overflow-y-auto bg-surface">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center px-5">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2">
          <Image
            src="/images/goal_blk.png"
            alt="GOAL Platform"
            width={100}
            height={32}
            className="h-7 w-auto dark:invert"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-4">
        <div className="space-y-1">
          {navLink('/', 'Dashboard')}
        </div>

        {/* Software Guides */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Software Guides
          </p>
          <div className="space-y-0.5">
            {softwareGuides.map((g) => navLink(`/guides/${g.slug}`, g.title))}
          </div>
        </div>

        {/* SOPs */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            SOPs
          </p>
          <div className="space-y-0.5">
            {sops.map((g) => navLink(`/guides/${g.slug}`, g.title))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
