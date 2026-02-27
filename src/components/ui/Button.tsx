import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-text-inverse hover:bg-primary-700 focus-visible:ring-primary-300',
  secondary:
    'bg-transparent text-primary border border-primary hover:bg-primary-50 focus-visible:ring-primary-300',
};

const base =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
