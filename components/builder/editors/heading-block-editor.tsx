'use client';

import { LessonBlock } from '@/lib/types/course';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface HeadingBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function HeadingBlockEditor({
  block,
  onUpdate,
}: HeadingBlockEditorProps) {
  const data = (block.data as any) || {};
  const level = data.level || 2;

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="heading-text">Heading Text</FieldLabel>
        <Input
          id="heading-text"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter heading text"
        />
      </div>

      <div>
        <FieldLabel htmlFor="heading-level">Heading Level</FieldLabel>
        <Select value={String(level)} onValueChange={(val) => 
          onUpdate({ data: { ...data, level: parseInt(val) } })
        }>
          <SelectTrigger id="heading-level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1 (Largest)</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
            <SelectItem value="5">H5</SelectItem>
            <SelectItem value="6">H6 (Smallest)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FieldGroup>
  );
}
