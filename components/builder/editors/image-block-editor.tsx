'use client';

import { LessonBlock } from '@/lib/types/course';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { useState } from 'react';

interface ImageBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function ImageBlockEditor({
  block,
  onUpdate,
}: ImageBlockEditorProps) {
  const data = (block.data as any) || {};
  const [previewUrl, setPreviewUrl] = useState(data?.url || '');

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onUpdate({ data: { ...data, url } });
  };

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="image-url">Image URL</FieldLabel>
        <Input
          id="image-url"
          value={previewUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <FieldLabel htmlFor="image-alt">Alt Text (Description)</FieldLabel>
        <Input
          id="image-alt"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Image description for accessibility"
        />
      </div>

      {previewUrl && (
        <div className="mt-4">
          <FieldLabel>Preview</FieldLabel>
          <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '';
              }}
            />
          </div>
        </div>
      )}
    </FieldGroup>
  );
}
