'use client';

import { CardForm } from '@/components/CardForm';

/**
 * 新規カード作成ページ
 */
export default function NewCardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <CardForm mode="create" />
    </div>
  );
}
