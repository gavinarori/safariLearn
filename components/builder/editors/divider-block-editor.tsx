'use client';

import { LessonBlock } from '@/lib/types/course';
import { Card, CardContent } from '@/components/ui/card';

interface DividerBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

export default function DividerBlockEditor({
  block,
  onUpdate,
}: DividerBlockEditorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground text-center">
          Divider blocks have no content to configure. They are used to visually separate sections.
        </p>
        <div className="w-full border-t my-4"></div>
        <p className="text-xs text-muted-foreground text-center">
          Preview of divider shown above
        </p>
      </CardContent>
    </Card>
  );
}
