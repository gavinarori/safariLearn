'use client';

import { LessonBlock } from '@/lib/types/course';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface TextBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function TextBlockEditor({
  block,
  onUpdate,
}: TextBlockEditorProps) {
  return (
    <FieldGroup>
      <FieldLabel htmlFor="text-content">Text Content (supports markdown)</FieldLabel>
      <Textarea
        id="text-content"
        value={block.content || ''}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Enter your text here. You can use **bold**, *italic*, etc."
        className="min-h-40"
      />
      <p className="text-xs text-muted-foreground mt-2">
        Markdown syntax: **bold**, *italic*, [link](url)
      </p>
    </FieldGroup>
  );
}
