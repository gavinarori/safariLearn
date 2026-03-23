import { LessonBlock } from '@/lib/types/course';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function FileBlock({ block, className = '' }: FileBlockProps) {
  const data = block.data as any;
  const url = data?.url || block.content || '';
  const filename = data?.filename || 'Download';

  if (!url) {
    return null;
  }

  return (
    <div className={`my-6 ${className}`.trim()}>
      <a href={url} download={filename} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {filename}
        </Button>
      </a>
    </div>
  );
}
