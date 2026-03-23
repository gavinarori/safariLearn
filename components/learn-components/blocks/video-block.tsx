import { LessonBlock, VideoBlockData } from '@/lib/types/course';

interface VideoBlockProps {
  block: LessonBlock;
  className?: string;
}

// Extract YouTube/Vimeo video ID from URL
function getEmbedUrl(url: string): string {
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // Return original URL if not recognized (assume it's an embed URL)
  return url;
}

export default function VideoBlock({ block, className = '' }: VideoBlockProps) {
  const data = block.data as VideoBlockData;

  return (
    <figure className={`my-6 ${className}`.trim()}>
      <div className="relative w-full bg-muted rounded-lg overflow-hidden aspect-video">
        <iframe
          src={getEmbedUrl(data.url)}
          title={data.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {data.title && <figcaption className="mt-2 text-sm text-muted-foreground text-center">{data.title}</figcaption>}
    </figure>
  );
}
