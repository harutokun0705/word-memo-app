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
  const { getCardById, deleteCard, cards } = useCards();

  const cardId = params.id as string;
  const card = getCardById(cardId);

  const handleDelete = async () => {
    if (confirm('本当にこのカードを削除しますか？')) {
      await deleteCard(cardId);
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

  // 関連カードの取得
  const relatedCards = card.relatedCardIds 
    ? card.relatedCardIds.map(id => getCardById(id)).filter((c): c is NonNullable<typeof c> => c !== undefined)
    : [];

  // バックリンク（このカードを参照しているカード）の取得
  const backlinks = cards.filter(c => c.relatedCardIds?.includes(card.id));



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
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-mono font-bold tracking-tight text-primary glow-text">{card.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              {card.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
              <Badge variant={card.status === 'output' ? 'default' : 'outline'} className={`text-xs font-normal border-border/50 ${card.status === 'output' ? 'bg-primary/20 text-primary border-primary/50' : 'text-muted-foreground'}`}>
                {card.status === 'output' ? 'OUT' : 'MEMO'}
              </Badge>
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
          
          {/* 関連カード & バックリンク */}
          {(relatedCards.length > 0 || backlinks.length > 0) && (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {relatedCards.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Related Cards</h3>
                  <div className="space-y-2">
                    {relatedCards.map(related => (
                      <Link key={related.id} href={`/cards/${related.id}`}>
                        <div className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors flex items-center justify-between group">
                          <span className="font-medium group-hover:text-primary transition-colors">{related.title}</span>
                          <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {backlinks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Linked From</h3>
                  <div className="space-y-2">
                    {backlinks.map(backlink => (
                      <Link key={backlink.id} href={`/cards/${backlink.id}`}>
                         <div className="p-3 rounded-lg border border-dashed hover:border-solid bg-card/50 hover:bg-accent transition-colors flex items-center justify-between group">
                          <span className="font-medium group-hover:text-primary transition-colors">{backlink.title}</span>
                          <span className="text-xs text-muted-foreground">Ref</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* メタ情報 */}
          <div className="mt-8 pt-6 border-t text-sm text-muted-foreground space-y-1">
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
