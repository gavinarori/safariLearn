import { LessonBlock, QuizBlockData } from '@/lib/types/course';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizBlockProps {
  block: LessonBlock;
  className?: string;
}

export default function QuizBlock({ block, className = '' }: QuizBlockProps) {
  const data = block.data as QuizBlockData;

  return (
    <div className={`my-6 ${className}`.trim()}>
      <Card>
        <CardHeader>
          <CardTitle>Quiz</CardTitle>
          <CardDescription>Quiz ID: {data.quiz_id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Quiz component. Link to your quiz content with ID: {data.quiz_id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
