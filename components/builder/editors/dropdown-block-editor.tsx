'use client';

import { LessonBlock } from '@/lib/types/course';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface DropdownBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function DropdownBlockEditor({
  block,
  onUpdate,
}: DropdownBlockEditorProps) {
  const data = (block.data as any) || {};

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="dropdown-title">Title (Click to Expand)</FieldLabel>
        <Input
          id="dropdown-title"
          value={data.title || ''}
          onChange={(e) => onUpdate({ data: { ...data, title: e.target.value } })}
          placeholder="Enter title"
        />
      </div>

      <div>
        <FieldLabel htmlFor="dropdown-content">Content (Hidden Until Expanded)</FieldLabel>
        <Textarea
          id="dropdown-content"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter dropdown content"
          className="min-h-40"
        />
      </div>
    </FieldGroup>
  );
}
