'use client';

import { LessonBlock } from '@/lib/types/course';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface QuizBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function QuizBlockEditor({
  block,
  onUpdate,
}: QuizBlockEditorProps) {
  const data = (block.data as any) || {};

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="quiz-id">Quiz ID</FieldLabel>
        <Input
          id="quiz-id"
          value={data.quiz_id || ''}
          onChange={(e) => onUpdate({ data: { ...data, quiz_id: e.target.value } })}
          placeholder="e.g., quiz-123"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Reference ID for linking to external quiz systems
        </p>
      </div>

      <div>
        <FieldLabel htmlFor="quiz-description">Description</FieldLabel>
        <Textarea
          id="quiz-description"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Brief description of the quiz"
          className="min-h-24"
        />
      </div>
    </FieldGroup>
  );
}
