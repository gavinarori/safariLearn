import { LessonBlock, CalloutBlockData } from '@/lib/types/course';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface CalloutBlockProps {
  block: LessonBlock;
  className?: string;
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
};

const variantMap = {
  info: 'default',
  warning: 'default',
  success: 'default',
  error: 'destructive',
} as const;

export default function CalloutBlock({ block, className = '' }: CalloutBlockProps) {
  const data = block.data as CalloutBlockData;
  const Icon = iconMap[data.type];
  const variant = variantMap[data.type];

  return (
    <div className={`my-6 ${className}`.trim()}>
      <Alert variant={variant}>
        <Icon className="h-4 w-4" />
        <AlertTitle>{data.title}</AlertTitle>
        <AlertDescription>{data.text}</AlertDescription>
      </Alert>
    </div>
  );
}
