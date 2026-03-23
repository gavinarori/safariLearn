import { LessonBlock } from '@/lib/types/course';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function QuizBlock({ block, className = '' }: QuizBlockProps) {
  const data = block.data as any;
  const quizId = data?.quiz_id || 'unknown';
  const description = block.content || 'Quiz available';

  return (
    <div className={`my-6 ${className}`.trim()}>
      <Card>
        <CardHeader>
          <CardTitle>Quiz</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Quiz component. Quiz ID: {quizId}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
