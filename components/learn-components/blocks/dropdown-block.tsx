'use client';

import { LessonBlock } from '@/lib/types/course';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface DropdownBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function DropdownBlock({ block, className = '' }: DropdownBlockProps) {
  const data = block.data as any;
  const [isOpen, setIsOpen] = useState(false);
  const title = data?.title || 'More Information';
  const content = block.content || '';

  if (!content) return null;

  return (
    <div className={`my-6 ${className}`.trim()}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 font-semibold text-foreground hover:text-foreground/80 transition-colors">
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          {title}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 pl-7 text-foreground">
          <p className="text-base leading-relaxed">{content}</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
