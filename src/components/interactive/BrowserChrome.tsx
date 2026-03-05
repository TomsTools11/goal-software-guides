interface BrowserChromeProps {
  title?: string;
  variant?: 'dark' | 'light';
  children: React.ReactNode;
  trailing?: React.ReactNode;
}

export function BrowserChrome({ title, variant = 'dark', children, trailing }: BrowserChromeProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-lg ${
        isDark ? 'border-white/10 bg-[#1e1e2e]' : 'border-gray-200 bg-white'
      }`}
    >
      <div
        className={`flex items-center gap-2 border-b px-4 py-2.5 ${
          isDark ? 'border-white/10 bg-[#181825]' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        {title && (
          <span
            className={`ml-3 flex-1 text-center text-[10px] ${
              isDark ? 'text-white/40' : 'text-gray-400'
            }`}
          >
            {title}
          </span>
        )}
        {trailing}
      </div>
      {children}
    </div>
  );
}
