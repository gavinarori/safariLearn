import { LessonBlock } from '@/lib/types/course';

interface HeadingBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function HeadingBlock({ block, className = '' }: HeadingBlockProps) {
  const data = block.data as any;
  const level = Math.min(Math.max(data?.level || 2, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
  const text = block.content || '';

  if (!text) return null;

  const headingStyles: Record<number, string> = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-bold',
    3: 'text-2xl font-bold',
    4: 'text-xl font-bold',
    5: 'text-lg font-bold',
    6: 'text-base font-bold',
  };

  const HeadingTag = `h${level}` as const;

  return (
    <div className={`my-6 ${className}`.trim()}>
      <HeadingTag className={`${headingStyles[level]} text-foreground`}>{text}</HeadingTag>
    </div>
  );
}
