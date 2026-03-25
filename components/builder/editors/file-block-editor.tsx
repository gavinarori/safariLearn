'use client';

import { LessonBlock } from '@/lib/types/course';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface FileBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function FileBlockEditor({
  block,
  onUpdate,
}: FileBlockEditorProps) {
  const data = (block.data as any) || {};

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="file-url">File URL</FieldLabel>
        <Input
          id="file-url"
          value={data.url || ''}
          onChange={(e) => onUpdate({ data: { ...data, url: e.target.value } })}
          placeholder="https://example.com/document.pdf"
        />
      </div>

      <div>
        <FieldLabel htmlFor="file-name">File Name (for Download Button)</FieldLabel>
        <Input
          id="file-name"
          value={data.filename || ''}
          onChange={(e) => onUpdate({ data: { ...data, filename: e.target.value } })}
          placeholder="e.g., course-notes.pdf"
        />
      </div>
    </FieldGroup>
  );
}
