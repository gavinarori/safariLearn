'use client';

import { LessonBlock } from '@/lib/types/course';
import { useState } from 'react';

interface ImageBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function ImageBlock({
  block,
  className = '',
}: ImageBlockProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const data = block.data as any;


  const imageUrl =
    data?.image ||
    data?.url ||
    data?.src ||
    null;

  const altText =
    block.content ||
    data?.alt ||
    'Lesson image';

  if (!imageUrl) {
    return (
      <figure className={`my-6 ${className}`}>
        <div className="w-full aspect-video flex items-center justify-center bg-muted rounded-lg">
          No image URL
        </div>
      </figure>
    );
  }

  return (
    <figure className={`my-6 ${className}`}>

      <div className="relative w-full rounded-lg overflow-hidden bg-muted">

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            Loading...
          </div>
        )}

        {!hasError ? (
          <img
            src={imageUrl}
            alt={altText}
            className={`w-full h-auto transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center">
            Image failed to load
          </div>
        )}

      </div>

      {altText && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {altText}
        </figcaption>
      )}

    </figure>
  );
}