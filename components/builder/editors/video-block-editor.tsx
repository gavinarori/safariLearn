'use client';

import { LessonBlock } from '@/lib/types/course';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface VideoBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function VideoBlockEditor({
  block,
  onUpdate,
}: VideoBlockEditorProps) {
  const data = (block.data as any) || {};

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="video-url">Video URL</FieldLabel>
        <Input
          id="video-url"
          value={data.url || ''}
          onChange={(e) => onUpdate({ data: { ...data, url: e.target.value } })}
          placeholder="https://youtu.be/... or https://vimeo.com/..."
        />
        <p className="text-xs text-muted-foreground mt-2">
          Supports YouTube, Vimeo, or embed URLs
        </p>
      </div>

      <div>
        <FieldLabel htmlFor="video-title">Video Title</FieldLabel>
        <Input
          id="video-title"
          value={data.title || ''}
          onChange={(e) => onUpdate({ data: { ...data, title: e.target.value } })}
          placeholder="Optional title for the video"
        />
      </div>
    </FieldGroup>
  );
}
