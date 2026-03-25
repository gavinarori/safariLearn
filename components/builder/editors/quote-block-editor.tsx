'use client';

import { LessonBlock } from '@/lib/types/course';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface QuoteBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function QuoteBlockEditor({
  block,
  onUpdate,
}: QuoteBlockEditorProps) {
  const data = (block.data as any) || {};

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="quote-text">Quote Text</FieldLabel>
        <Textarea
          id="quote-text"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter the quote"
          className="min-h-24"
        />
      </div>

      <div>
        <FieldLabel htmlFor="quote-attribution">Attribution (Author Name)</FieldLabel>
        <Input
          id="quote-attribution"
          value={data.attribution || ''}
          onChange={(e) => onUpdate({ data: { ...data, attribution: e.target.value } })}
          placeholder="e.g., Albert Einstein"
        />
      </div>
    </FieldGroup>
  );
}
