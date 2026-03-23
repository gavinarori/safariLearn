'use client';

import Image from 'next/image';
import { LessonBlock, ImageBlockData } from '@/lib/types/course';
import { useState } from 'react';

interface ImageBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function ImageBlock({ block, className = '' }: ImageBlockProps) {
  const data = block.data as ImageBlockData;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <figure className={`my-6 ${className}`.trim()}>
      <div className="relative w-full bg-muted rounded-lg overflow-hidden">
        {!hasError ? (
          <img
            src={data.url}
            alt={data.alt || 'Lesson image'}
            className={`w-full h-auto object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center bg-muted text-muted-foreground">
            <span>Image failed to load</span>
          </div>
        )}
      </div>
      {data.caption && <figcaption className="mt-2 text-sm text-muted-foreground text-center">{data.caption}</figcaption>}
    </figure>
  );
}
