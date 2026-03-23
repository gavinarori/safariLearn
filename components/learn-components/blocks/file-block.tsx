import { LessonBlock, FileBlockData } from '@/lib/types/course';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function FileBlock({ block, className = '' }: FileBlockProps) {
  const data = block.data as FileBlockData;

  return (
    <div className={`my-6 ${className}`.trim()}>
      <a href={data.url} download={data.filename}>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {data.filename}
        </Button>
      </a>
    </div>
  );
}
