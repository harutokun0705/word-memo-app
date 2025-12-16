/**
 * Spaced Repetition (SM-2 Algorithm) Implementation
 * Based on SuperMemo 2 Algorithm
 * Reference: https://supermemo.guru/wiki/SM-2
 */

import { WordCard } from '@/features/cards/types';

/**
 * 復習の難易度評価
 * 0: 完全な忘却 (Blackout)
 * 3: 難しかったが思い出せた (Hard)
 * 4: 迷わず思い出せた (Good)
 * 5: 完璧に記憶している (Easy)
 */
export type ReviewGrade = 0 | 3 | 4 | 5;

// 一日のミリ秒数
const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * 次回の復習スケジュールを計算する
 * @param card 現在のカード状態
 * @param grade ユーザー評価 (0-5)
 * @returns 更新されたカードのプロパティ（interval, easeFactor, nextReviewDate, reviewCount）
 */
export function calculateNextReview(card: WordCard, grade: ReviewGrade) {
  let { interval, easeFactor, reviewCount } = card;

  // 初期値の未設定対応
  if (easeFactor === undefined) easeFactor = 2.5;
  if (interval === undefined) interval = 0;
  if (reviewCount === undefined) reviewCount = 0;

  // SM-2 Algorithm Logic
  
  if (grade >= 3) {
    // 正解（思い出せた）場合
    if (reviewCount === 0) {
      interval = 1;
    } else if (reviewCount === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    
    reviewCount += 1;
  } else {
    // 不正解（忘れていた）場合
    reviewCount = 0;
    interval = 1;
  }

  // Ease Factor の更新
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // q = grade
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  
  // EFの下限は1.3
  if (easeFactor < 1.3) easeFactor = 1.3;

  // 次回復習日の計算
  const nextReviewDate = new Date();
  nextReviewDate.setHours(0, 0, 0, 0); // 今日の0時基準
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    interval,
    easeFactor,
    reviewCount,
    nextReviewDate,
    lastReviewedAt: new Date()
  };
}

/**
 * 学習が必要なカードかどうかを判定
 */
export function isReviewNeeded(card: WordCard): boolean {
  if (!card.nextReviewDate) return true; // 未学習なら必要
  const today = new Date();
  today.setHours(23, 59, 59, 999); // 今日の終わりまで許容
  return new Date(card.nextReviewDate) <= today;
}
