import { LessonBlock, QuoteBlockData } from '@/lib/types/course';

interface QuoteBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function QuoteBlock({ block, className = '' }: QuoteBlockProps) {
  const data = block.data as QuoteBlockData;

  return (
    <div className={`my-6 ${className}`.trim()}>
      <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/80">
        <p className="text-base leading-relaxed mb-2">{data.text}</p>
        {data.attribution && (
          <footer className="text-sm font-semibold text-foreground">— {data.attribution}</footer>
        )}
      </blockquote>
    </div>
  );
}
