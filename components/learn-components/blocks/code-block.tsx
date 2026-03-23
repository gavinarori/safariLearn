'use client';

import { LessonBlock, CodeBlockData } from '@/lib/types/course';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function CodeBlock({ block, className = '' }: CodeBlockProps) {
  const data = block.data as CodeBlockData;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`my-6 ${className}`.trim()}>
      <div className="bg-muted rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-muted-foreground/10 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground">{data.language || 'code'}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className="font-mono text-sm text-foreground whitespace-pre">{data.code}</code>
        </pre>
      </div>
    </div>
  );
}
