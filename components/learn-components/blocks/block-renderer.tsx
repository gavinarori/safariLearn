'use client';

import { LessonBlock } from '@/lib/types/course';
import TextBlock from './text-block';
import HeadingBlock from './heading-block';
import ImageBlock from './image-block';
import ListBlock from './list-block';
import CalloutBlock from './callout-block';
import DropdownBlock from './dropdown-block';
import QuoteBlock from './quote-block';
import CodeBlock from './code-block';
import VideoBlock from './video-block';
import FileBlock from './file-block';
import TableBlock from './table-block';
import DividerBlock from './divider-block';
import QuizBlock from './quiz-block';

interface BlockRendererProps {
  block: LessonBlock;
  className?: string;
}

export default function BlockRenderer({ block, className = '' }: BlockRendererProps) {
  const baseClassName = `block-${block.type} ${className}`.trim();

  switch (block.type) {
    case 'text':
      return <TextBlock block={block} className={baseClassName} />;
    case 'heading':
      return <HeadingBlock block={block} className={baseClassName} />;
    case 'image':
      return <ImageBlock block={block} className={baseClassName} />;
    case 'list':
      return <ListBlock block={block} className={baseClassName} />;
    case 'callout':
      return <CalloutBlock block={block} className={baseClassName} />;
    case 'dropdown':
      return <DropdownBlock block={block} className={baseClassName} />;
    case 'quote':
      return <QuoteBlock block={block} className={baseClassName} />;
    case 'code':
      return <CodeBlock block={block} className={baseClassName} />;
    case 'video':
      return <VideoBlock block={block} className={baseClassName} />;
    case 'file':
      return <FileBlock block={block} className={baseClassName} />;
    case 'table':
      return <TableBlock block={block} className={baseClassName} />;
    case 'divider':
      return <DividerBlock block={block} className={baseClassName} />;
    case 'quiz':
      return <QuizBlock block={block} className={baseClassName} />;
    default:
      const _exhaustive: any = block;
      return _exhaustive;
  }
}
