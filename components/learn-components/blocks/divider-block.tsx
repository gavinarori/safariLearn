import { LessonBlock } from '@/lib/types/course';
import { Separator } from '@/components/ui/separator';

interface DividerBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function DividerBlock({ block, className = '' }: DividerBlockProps) {
  return (
    <div className={`my-8 ${className}`.trim()}>
      <Separator />
    </div>
  );
}
