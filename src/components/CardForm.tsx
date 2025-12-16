'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MarkdownEditor } from './MarkdownEditor';
import { TagInput } from './TagInput';
import { useCards } from '@/contexts/CardContext';
import { WordCard } from '@/types';

interface CardFormProps {
  mode: 'create' | 'edit';
  initialData?: WordCard;
}

/**
 * カード作成・編集フォーム
 */
export function CardForm({ mode, initialData }: CardFormProps) {
  const router = useRouter();
  const { addCard, updateCard } = useCards();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        addCard({ title, content, tags });
      } else if (initialData) {
        updateCard(initialData.id, { title, content, tags });
      }
      router.push('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? '新規カード作成' : 'カード編集'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* タイトル入力 */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="用語名を入力"
              required
            />
          </div>

          {/* Markdownエディタ */}
          <div className="space-y-2">
            <Label>内容 (Markdown)</Label>
            <MarkdownEditor value={content} onChange={setContent} />
          </div>

          {/* タグ入力 */}
          <div className="space-y-2">
            <Label>タグ</Label>
            <TagInput tags={tags} onChange={setTags} />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
