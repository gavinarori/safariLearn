'use client';

import { LessonBlock } from '@/lib/types/course';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface CodeBlockEditorProps {
  block: LessonBlock;
  onUpdate: (updates: Partial<LessonBlock>) => void;
}

const LANGUAGES = ['javascript', 'python', 'html', 'css', 'typescript', 'sql', 'bash', 'json'];

export default function CodeBlockEditor({
  block,
  onUpdate,
}: CodeBlockEditorProps) {
  const data = (block.data as any) || {};
  const language = data.language || 'javascript';

  return (
    <FieldGroup className="space-y-4">
      <div>
        <FieldLabel htmlFor="code-language">Language</FieldLabel>
        <Select value={language} onValueChange={(val) =>
          onUpdate({ data: { ...data, language: val } })
        }>
          <SelectTrigger id="code-language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(lang => (
              <SelectItem key={lang} value={lang} className="capitalize">
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FieldLabel htmlFor="code-content">Code</FieldLabel>
        <Textarea
          id="code-content"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Paste your code here"
          className="min-h-40 font-mono"
        />
      </div>
    </FieldGroup>
  );
}
