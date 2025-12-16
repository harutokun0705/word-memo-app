'use client';

import Link from 'next/link';
import { Plus, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardList } from '@/features/cards/components/CardList';
import { useCards } from '@/features/cards/contexts/CardContext';

/**
 * ダッシュボード（ホーム）ページ
 * カード一覧と統計情報を表示
 */
export default function DashboardPage() {
  const { cards } = useCards();

  return (
    <div className="space-y-8">
      {/* ヘッダーセクション */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">単語カード一覧</h1>
          <p className="text-muted-foreground mt-1">
            {cards.length}枚のカードが登録されています
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/cards/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </Link>
          <Link href="/quiz">
            <Button variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              クイズ
            </Button>
          </Link>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-4 border">
          <div className="text-2xl font-bold">{cards.length}</div>
          <div className="text-sm text-muted-foreground">総カード数</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg p-4 border">
          <div className="text-2xl font-bold">
            {cards.reduce((acc, card) => acc + card.reviewCount, 0)}
          </div>
          <div className="text-sm text-muted-foreground">総復習回数</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg p-4 border">
          <div className="text-2xl font-bold">
            {new Set(cards.flatMap(card => card.tags)).size}
          </div>
          <div className="text-sm text-muted-foreground">タグ数</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg p-4 border">
          <div className="text-2xl font-bold">
            {cards.filter(card => card.reviewCount === 0).length}
          </div>
          <div className="text-sm text-muted-foreground">未復習</div>
        </div>
      </div>

      {/* カード一覧 */}
      <CardList />
    </div>
  );
}
