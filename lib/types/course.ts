// Discriminated Union Types for Lesson Blocks
export type TextBlockData = {
  text: string;
};

export type HeadingBlockData = {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export type ImageBlockData = {
  url: string;
  alt: string;
  caption?: string;
};

export type ListBlockData = {
  items: string[];
  ordered: boolean;
};

export type CalloutBlockData = {
  title: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'error';
};

export type DropdownBlockData = {
  title: string;
  content: string;
};

export type QuoteBlockData = {
  text: string;
  attribution?: string;
};

export type CodeBlockData = {
  code: string;
  language: string;
};

export type VideoBlockData = {
  url: string;
  title: string;
};

export type FileBlockData = {
  url: string;
  filename: string;
};

export type TableBlockData = {
  headers: string[];
  rows: string[][];
};

export type DividerBlockData = Record<string, never>;

export type QuizBlockData = {
  quiz_id: string;
};

// Discriminated Union Type for all block data
export type BlockData =
  | { type: 'text'; data: TextBlockData }
  | { type: 'heading'; data: HeadingBlockData }
  | { type: 'image'; data: ImageBlockData }
  | { type: 'list'; data: ListBlockData }
  | { type: 'callout'; data: CalloutBlockData }
  | { type: 'dropdown'; data: DropdownBlockData }
  | { type: 'quote'; data: QuoteBlockData }
  | { type: 'code'; data: CodeBlockData }
  | { type: 'video'; data: VideoBlockData }
  | { type: 'file'; data: FileBlockData }
  | { type: 'table'; data: TableBlockData }
  | { type: 'divider'; data: DividerBlockData }
  | { type: 'quiz'; data: QuizBlockData };

// Lesson Block from Database
export interface LessonBlock {
  id: string;
  lesson_id: string;
  type:
    | 'text'
    | 'heading'
    | 'image'
    | 'list'
    | 'callout'
    | 'dropdown'
    | 'quote'
    | 'code'
    | 'video'
    | 'file'
    | 'table'
    | 'divider'
    | 'quiz';
  content?: string;
  data: Record<string, unknown>;
  position: number;
  created_at: string;
}

// Lesson with nested blocks
export interface Lesson {
  id: string;
  created_at: string;
  course_id: string;
  title: string;
  content?: string;
  order_index: number;
  is_preview: boolean;
  key_topics?: string;
  learning_materials?: string;
  reading_time?: number;
  module_id: string;
  lesson_blocks: LessonBlock[];
}

// Course Module with nested lessons
export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  position: number;
  created_at: string;
  course_id: string;
  banner_image_url?: string;
  lessons: Lesson[];
}

// Course with nested modules
export interface Course {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  price?: number;
  category?: string;
  level?: string;
  language?: string;
  status?: string;
  updated_at?: string;
  course_modules: CourseModule[];
}

// Type guards for discriminated unions
export function isTextBlock(block: LessonBlock): block is LessonBlock & { type: 'text' } {
  return block.type === 'text';
}

export function isHeadingBlock(block: LessonBlock): block is LessonBlock & { type: 'heading' } {
  return block.type === 'heading';
}

export function isImageBlock(block: LessonBlock): block is LessonBlock & { type: 'image' } {
  return block.type === 'image';
}

export function isListBlock(block: LessonBlock): block is LessonBlock & { type: 'list' } {
  return block.type === 'list';
}

export function isCalloutBlock(block: LessonBlock): block is LessonBlock & { type: 'callout' } {
  return block.type === 'callout';
}

export function isDropdownBlock(block: LessonBlock): block is LessonBlock & { type: 'dropdown' } {
  return block.type === 'dropdown';
}

export function isQuoteBlock(block: LessonBlock): block is LessonBlock & { type: 'quote' } {
  return block.type === 'quote';
}

export function isCodeBlock(block: LessonBlock): block is LessonBlock & { type: 'code' } {
  return block.type === 'code';
}

export function isVideoBlock(block: LessonBlock): block is LessonBlock & { type: 'video' } {
  return block.type === 'video';
}

export function isFileBlock(block: LessonBlock): block is LessonBlock & { type: 'file' } {
  return block.type === 'file';
}

export function isTableBlock(block: LessonBlock): block is LessonBlock & { type: 'table' } {
  return block.type === 'table';
}

export function isDividerBlock(block: LessonBlock): block is LessonBlock & { type: 'divider' } {
  return block.type === 'divider';
}

export function isQuizBlock(block: LessonBlock): block is LessonBlock & { type: 'quiz' } {
  return block.type === 'quiz';
}
