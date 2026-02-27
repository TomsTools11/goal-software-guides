'use client';

import Image from 'next/image';

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  title?: string;
  fullWidth?: boolean;
}

export function Screenshot({ src, alt, caption, title, fullWidth = false }: ScreenshotProps) {
  return (
    <figure className={`my-6 ${fullWidth ? '' : 'mx-auto max-w-2xl'}`}>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1e1e2e] shadow-lg">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#181825] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          {title && (
            <span className="ml-3 flex-1 text-center text-[10px] text-white/40">
              {title}
            </span>
          )}
        </div>

        {/* Screenshot */}
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          />
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-xs text-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
