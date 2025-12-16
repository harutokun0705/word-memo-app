'use client';

import { Textarea } from '@/components/ui/textarea';
import { MarkdownPreview } from './MarkdownPreview';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Markdownエディタコンポーネント
 * 左側にエディタ、右側にプレビューを表示
 */
export function MarkdownEditor({ value, onChange, placeholder = 'Markdownで記述...' }: MarkdownEditorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* エディタ部分 */}
      <div className="flex flex-col">
        <div className="text-sm font-medium mb-2 text-muted-foreground">
          エディタ
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-h-[300px] font-mono text-sm resize-none text-primary glow-text placeholder:text-muted-foreground/30 focus-visible:ring-primary/50"
        />
      </div>

      {/* プレビュー部分 */}
      <div className="flex flex-col">
        <div className="text-sm font-medium mb-2 text-muted-foreground">
          プレビュー
        </div>
        <div className="flex-1 border rounded-md p-4 bg-muted/30 overflow-auto min-h-[300px]">
          {value ? (
            <MarkdownPreview content={value} />
          ) : (
            <p className="text-muted-foreground text-sm">
              プレビューがここに表示されます
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
