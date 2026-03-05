'use client';

import Image from 'next/image';
import { useThemeProvider } from '@/hooks/useTheme';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeProvider();

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-soft px-4">
        <div className="mb-8 text-center">
          <Image
            src={theme === 'dark' ? '/images/goal_wht.png' : '/images/goal_blk.png'}
            alt="GOAL Platform"
            width={160}
            height={52}
            className="mx-auto h-12 w-auto"
            priority
          />
          <p className="mt-3 text-sm font-medium tracking-wide text-text-muted">
            Training Platform
          </p>
        </div>
        {children}
      </div>
    </AuthGuard>
  );
}
