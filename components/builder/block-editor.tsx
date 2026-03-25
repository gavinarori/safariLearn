'use client';

import { useState, useCallback } from 'react';
import { LessonBlock } from '@/lib/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextBlockEditor from './editors/text-block-editor';
import HeadingBlockEditor from './editors/heading-block-editor';
import ImageBlockEditor from './editors/image-block-editor';
import ListBlockEditor from './editors/list-block-editor';
import CalloutBlockEditor from './editors/callout-block-editor';
import DropdownBlockEditor from './editors/dropdown-block-editor';
import QuoteBlockEditor from './editors/quote-block-editor';
import CodeBlockEditor from './editors/code-block-editor';
import VideoBlockEditor from './editors/video-block-editor';
import FileBlockEditor from './editors/file-block-editor';
import TableBlockEditor from './editors/table-block-editor';
import DividerBlockEditor from './editors/divider-block-editor';
import QuizBlockEditor from './editors/quiz-block-editor';
import BlockPreview from './block-preview';
import { Button } from '@/components/ui/button';
import { X, Copy } from 'lucide-react';

interface BlockEditorProps {
  block: LessonBlock;
  onUpdate: (block: LessonBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const BLOCK_TYPES = [
  'text',
  'heading',
  'image',
  'list',
  'callout',
  'dropdown',
  'quote',
  'code',
  'video',
  'file',
  'table',
  'divider',
  'quiz',
] as const;

export default function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onDuplicate,
}: BlockEditorProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  const handleUpdate = useCallback(
    (updates: Partial<LessonBlock>) => {
      onUpdate({ ...block, ...updates });
    },
    [block, onUpdate]
  );

  const renderEditor = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'heading':
        return <HeadingBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'image':
        return <ImageBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'list':
        return <ListBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'callout':
        return <CalloutBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'dropdown':
        return <DropdownBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'quote':
        return <QuoteBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'code':
        return <CodeBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'video':
        return <VideoBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'file':
        return <FileBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'table':
        return <TableBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'divider':
        return <DividerBlockEditor block={block} onUpdate={handleUpdate} />;
      case 'quiz':
        return <QuizBlockEditor block={block} onUpdate={handleUpdate} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div className="flex gap-4">
      {/* Editor Panel */}
      <div className="flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="capitalize">{block.type} Block</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Position: {block.position}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDuplicate}
                title="Duplicate this block"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                title="Delete this block"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {renderEditor()}
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      {isPreviewOpen && (
        <div className="w-80">
          <BlockPreview block={block} />
        </div>
      )}
    </div>
  );
}
