'use client';

import { LessonBlock } from '@/lib/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BlockRenderer from '@/components/learn-components/blocks/block-renderer';

interface BlockPreviewProps {
  block: LessonBlock;
}

export default function BlockPreview({ block }: BlockPreviewProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-sm">Preview</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        <BlockRenderer block={block} />
      </CardContent>
    </Card>
  );
}
