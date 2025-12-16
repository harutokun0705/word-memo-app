'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { useCards } from '@/features/cards/contexts/CardContext';

/**
 * カード詳細ページ
 */
export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getCardById, deleteCard } = useCards();
  
  const cardId = params.id as string;
  const card = getCardById(cardId);

  const handleDelete = () => {
    if (confirm('このカードを削除しますか？')) {
      deleteCard(cardId);
      router.push('/');
    }
  };

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
      <Link href="/">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          一覧に戻る
        </Button>
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{card.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              {card.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/cards/${cardId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                編集
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              削除
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-6 min-h-[300px]">
            {card.content ? (
              <MarkdownPreview content={card.content} />
            ) : (
              <p className="text-muted-foreground">内容がありません</p>
            )}
          </div>
          
          {/* メタ情報 */}
          <div className="mt-6 text-sm text-muted-foreground space-y-1">
            <p>作成日: {card.createdAt.toLocaleString('ja-JP')}</p>
            <p>更新日: {card.updatedAt.toLocaleString('ja-JP')}</p>
            <p>復習回数: {card.reviewCount}回</p>
            {card.lastReviewedAt && (
              <p>最終復習: {card.lastReviewedAt.toLocaleString('ja-JP')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
