'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  accentColor: string;
}

export function StatCard({ icon, value, label, accentColor }: StatCardProps) {
  return (
    <motion.div
      className="rounded-xl border border-border bg-white p-5 shadow-sm"
      style={{ borderTopWidth: 3, borderTopColor: accentColor }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3 text-text-muted">{icon}</div>
      <p className="text-3xl font-bold text-text">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </motion.div>
  );
}
