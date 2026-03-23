'use client';

import { Lesson } from '@/lib/types/course';
import BlockRenderer from './blocks/block-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentSectionProps {
  lesson: Lesson;
}

export default function ContentSection({ lesson }: ContentSectionProps) {
  if (!lesson.lesson_blocks || lesson.lesson_blocks.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No content available for this lesson yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {lesson.lesson_blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
