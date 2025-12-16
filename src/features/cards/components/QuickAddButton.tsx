'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TagInput } from '@/components/TagInput';
import { useCards } from '../contexts/CardContext';

/**
 * QuickAddフローティングボタン
 * クリックでモーダルを表示
 */
export function QuickAddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { addCard } = useCards();

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    addCard({ title, content, tags });
    
    // フォームをリセット
    setTitle('');
    setContent('');
    setTags([]);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setContent('');
    setTags([]);
  };

  return (
    <>
      {/* フローティングボタン */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">クイック追加</span>
      </Button>

      {/* 簡易入力モーダル */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>クイック追加</DialogTitle>
            <DialogDescription>
              素早く単語カードを追加できます
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* タイトル */}
            <div className="space-y-2">
              <Label htmlFor="quick-title">タイトル *</Label>
              <Input
                id="quick-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="用語名を入力"
                autoFocus
              />
            </div>

            {/* タグ */}
            <div className="space-y-2">
              <Label>タグ</Label>
              <TagInput tags={tags} onChange={setTags} />
            </div>

            {/* 内容（任意） */}
            <div className="space-y-2">
              <Label htmlFor="quick-content">メモ（任意）</Label>
              <Textarea
                id="quick-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="簡単なメモ（Markdown可）"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim()}>
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
