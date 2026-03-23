import { LessonBlock } from '@/lib/types/course';

interface ListBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function ListBlock({ block, className = '' }: ListBlockProps) {
  if (!block.content) {
    return null;
  }

  // Parse markdown list from content
  const lines = block.content.split('\n').filter(line => line.trim());
  
  // Detect if ordered (numbered) or unordered (- or *)
  const isOrdered = /^\d+\./.test(lines[0]);
  
  // Extract list items
  const items = lines.map(line => {
    // Remove list markers: "- item", "* item", "1. item"
    return line.replace(/^[-*]\s+|\d+\.\s+/, '').trim();
  }).filter(item => item);

  const ListTag = isOrdered ? 'ol' : 'ul';

  return (
    <div className={`my-6 ${className}`.trim()}>
      <ListTag
        className={`space-y-2 pl-6 text-foreground ${
          isOrdered ? 'list-decimal' : 'list-disc'
        }`}
      >
        {items.map((item, index) => (
          <li key={index} className="text-base leading-relaxed">
            {item}
          </li>
        ))}
      </ListTag>
    </div>
  );
}
