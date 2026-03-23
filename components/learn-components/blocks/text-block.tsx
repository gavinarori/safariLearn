import { LessonBlock } from '@/lib/types/course';
import ReactMarkdown from 'react-markdown';

interface TextBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function TextBlock({ block, className = '' }: TextBlockProps) {
  const text = block.content || '';

  if (!text) return null;

  return (
    <div className={`prose prose-sm max-w-none text-foreground ${className}`.trim()}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="text-base leading-relaxed mb-4">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
