'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizCard } from '@/features/quiz/components/QuizCard';

/**
 * クイズページ
 * ランダムなカードで復習
 */
export default function QuizPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 戻るボタン */}
      <Link href="/">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          ホームに戻る
        </Button>
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">クイズモード 🧠</h1>
        <p className="text-muted-foreground mt-2">
          登録した単語カードでクイズに挑戦しましょう
        </p>
      </div>

      <QuizCard />
    </div>
  );
}
