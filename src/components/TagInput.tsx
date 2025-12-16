'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/**
 * タグ入力コンポーネント
 * Enterキーで追加、バッジクリックで削除
 */
export function TagInput({ tags, onChange, placeholder = 'タグを入力...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // 入力が空の状態でBackspaceを押すと最後のタグを削除
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 cursor-pointer hover:bg-destructive/20"
            onClick={() => removeTag(tag)}
          >
            {tag}
            <X className="h-3 w-3" />
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Enterキーで追加、タグをクリックで削除
      </p>
    </div>
  );
}
