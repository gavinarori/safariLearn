import { LessonBlock } from '@/lib/types/course';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
} as const;

const variantMap = {
  info: 'default',
  warning: 'default',
  success: 'default',
  error: 'destructive',
} as const;

export default function CalloutBlock({ block, className = '' }: CalloutBlockProps) {
  // Use content field for callout text, default to 'info' type
  const data = block.data as any;
  const type = (data?.type || 'info') as keyof typeof iconMap;
  const Icon = iconMap[type] || Info;
  const variant = variantMap[type] || 'default';
  const text = block.content || '';

  if (!text) return null;

  return (
    <div className={`my-6 ${className}`.trim()}>
      <Alert variant={variant as any}>
        <Icon className="h-4 w-4" />
        <AlertDescription>{text}</AlertDescription>
      </Alert>
    </div>
  );
}
