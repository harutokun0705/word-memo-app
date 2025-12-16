'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardForm } from '@/features/cards/components/CardForm';
import { useCards } from '@/features/cards/contexts/CardContext';

/**
 * カード編集ページ
 */
export default function EditCardPage() {
  const params = useParams();
  const { getCardById } = useCards();
  
  const cardId = params.id as string;
  const card = getCardById(cardId);

  if (!card) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">カードが見つかりません</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            ホームに戻る
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 戻るボタン */}
      <Link href={`/cards/${cardId}`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          詳細に戻る
        </Button>
      </Link>

      <CardForm mode="edit" initialData={card} />
    </div>
  );
}
