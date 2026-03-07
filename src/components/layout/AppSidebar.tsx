'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getGuidesByCategory } from '@/lib/guides';
import { useTheme } from '@/hooks/useTheme';


interface AppSidebarProps {
  onNavigate?: () => void;
}

const softwareGuides = getGuidesByCategory('software');
const accountManagement = getGuidesByCategory('account-management');
const salesGuides = getGuidesByCategory('sales');

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  function navLink(href: string, label: string) {
    const isActive = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
          isActive
            ? 'border-l-2 border-primary bg-primary/10 font-semibold text-primary'
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
            src={theme === 'dark' ? '/images/goal_wht.png' : '/images/goal_blk.png'}
            alt="GOAL Platform"
            width={100}
            height={32}
            className="h-7 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-4">
        <div className="space-y-1">
          {navLink('/', 'Dashboard')}
        </div>

        {/* Software */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Software
          </p>
          <div className="space-y-0.5">
            {softwareGuides.map((g) => navLink(`/guides/${g.slug}`, g.title))}
          </div>
        </div>

        {/* Account Management */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Account Management
          </p>
          <div className="space-y-0.5">
            {accountManagement.map((g) => navLink(`/guides/${g.slug}`, g.title))}
          </div>
        </div>

        {/* Sales */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Sales
          </p>
          <div className="space-y-0.5">
            {salesGuides.map((g) => navLink(`/guides/${g.slug}`, g.title))}
          </div>
        </div>
      </nav>

      {/* Bottom: Account */}
      <div className="border-t border-border px-3 py-3">
        {navLink('/account', 'Account')}
      </div>
    </aside>
  );
}
