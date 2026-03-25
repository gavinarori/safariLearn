'use client';

import { LessonBlock } from '@/lib/types/course';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface CalloutBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

const CALLOUT_TYPES = ['info', 'warning', 'success', 'error'] as const;

export default function CalloutBlockEditor({
  block,
  onUpdate,
}: CalloutBlockEditorProps) {
  const data = (block.data as any) || {};
  const type = data.type || 'info';

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="callout-type">Callout Type</FieldLabel>
        <Select value={type} onValueChange={(val) =>
          onUpdate({ data: { ...data, type: val } })
        }>
          <SelectTrigger id="callout-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info (Blue)</SelectItem>
            <SelectItem value="warning">Warning (Orange)</SelectItem>
            <SelectItem value="success">Success (Green)</SelectItem>
            <SelectItem value="error">Error (Red)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <FieldLabel htmlFor="callout-text">Callout Text</FieldLabel>
        <Textarea
          id="callout-text"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter callout text"
          className="min-h-24"
        />
      </div>
    </FieldGroup>
  );
}
