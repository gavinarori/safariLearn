'use client';

import { LessonBlock } from '@/lib/types/course';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';

interface ListBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function ListBlockEditor({
  block,
  onUpdate,
}: ListBlockEditorProps) {
  const data = (block.data as any) || {};
  const isOrdered = data.ordered || false;

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel>List Type</FieldLabel>
        <RadioGroup value={isOrdered ? 'ordered' : 'unordered'} onValueChange={(val) =>
          onUpdate({ data: { ...data, ordered: val === 'ordered' } })
        }>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unordered" id="unordered" />
            <Label htmlFor="unordered">Unordered (bullet points)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ordered" id="ordered" />
            <Label htmlFor="ordered">Ordered (numbered)</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <FieldLabel htmlFor="list-items">List Items (one per line)</FieldLabel>
        <Textarea
          id="list-items"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder={isOrdered ? '1. First item\n2. Second item\n3. Third item' : '- First item\n- Second item\n- Third item'}
          className="min-h-40"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {isOrdered ? 'Use "1. ", "2. ", "3. " format' : 'Use "- " prefix for each item'}
        </p>
      </div>
    </FieldGroup>
  );
}
