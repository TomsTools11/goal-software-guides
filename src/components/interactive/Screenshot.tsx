'use client';

import Image from 'next/image';
import { BrowserChrome } from './BrowserChrome';

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
      <BrowserChrome title={title}>
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
      </BrowserChrome>

      {caption && (
        <figcaption className="mt-2 text-center text-xs text-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
