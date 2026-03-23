import { LessonBlock, ListBlockData } from '@/lib/types/course';

interface ListBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function ListBlock({ block, className = '' }: ListBlockProps) {
  const data = block.data as ListBlockData;

  const ListTag = data.ordered ? 'ol' : 'ul';

  return (
    <div className={`my-6 ${className}`.trim()}>
      <ListTag
        className={`space-y-2 pl-6 text-foreground ${
          data.ordered ? 'list-decimal' : 'list-disc'
        }`}
      >
        {data.items.map((item, index) => (
          <li key={index} className="text-base leading-relaxed">
            {item}
          </li>
        ))}
      </ListTag>
    </div>
    
  );
}
