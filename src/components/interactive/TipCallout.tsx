type TipVariant = 'tip' | 'warning' | 'info' | 'important';

interface TipCalloutProps {
  variant?: TipVariant;
  title?: string;
  children: React.ReactNode;
}

const config: Record<TipVariant, { bg: string; border: string; icon: string; iconColor: string }> = {
  tip: {
    bg: 'bg-success/10',
    border: 'border-l-success',
    icon: '💡',
    iconColor: 'text-success',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-l-warning',
    icon: '⚠️',
    iconColor: 'text-warning',
  },
  info: {
    bg: 'bg-primary/10',
    border: 'border-l-primary',
    icon: 'ℹ️',
    iconColor: 'text-primary',
  },
  important: {
    bg: 'bg-accent/10',
    border: 'border-l-accent',
    icon: '🔑',
    iconColor: 'text-accent',
  },
};

export function TipCallout({ variant = 'tip', title, children }: TipCalloutProps) {
  const c = config[variant];

  return (
    <div className={`my-5 rounded-r-lg border-l-4 ${c.border} ${c.bg} px-5 py-4`}>
      {title && (
        <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-text">
          <span>{c.icon}</span>
          {title}
        </p>
      )}
      <div className="text-sm leading-relaxed text-text-muted">{children}</div>
    </div>
  );
}
