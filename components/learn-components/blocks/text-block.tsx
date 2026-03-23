import { LessonBlock, TextBlockData } from '@/lib/types/course';

interface TextBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function TextBlock({ block, className = '' }: TextBlockProps) {
  const data = block.data as TextBlockData;

  return (
    <div className={`prose prose-sm max-w-none ${className}`.trim()}>
      <p className="text-base leading-relaxed text-foreground">{data.text}</p>
    </div>
  );
}
