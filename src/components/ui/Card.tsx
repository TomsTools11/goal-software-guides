'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

const base = 'rounded-xl border border-border bg-surface p-6 shadow-sm';

export function Card({ children, className = '', interactive = false }: CardProps) {
  if (interactive) {
    return (
      <motion.div
        className={`${base} ${className}`}
        whileHover={{ y: -4, boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
}
