'use client';

import Image from 'next/image';
import { useThemeProvider } from '@/hooks/useTheme';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeProvider();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-soft px-4">
      <div className="mb-8">
        <Image
          src={theme === 'dark' ? '/images/goal_wht.png' : '/images/goal_blk.png'}
          alt="GOAL Platform"
          width={140}
          height={45}
          className="h-10 w-auto"
          priority
        />
      </div>
      {children}
    </div>
  );
}
