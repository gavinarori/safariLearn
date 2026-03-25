'use client';

import { LessonBlock } from '@/lib/types/course';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface TableBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function TableBlockEditor({
  block,
  onUpdate,
}: TableBlockEditorProps) {
  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="table-content">Table (Markdown Format)</FieldLabel>
        <Textarea
          id="table-content"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder={`| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`}
          className="min-h-40 font-mono"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Use markdown table format with | separators and - for borders
        </p>
      </div>
    </FieldGroup>
  );
}
