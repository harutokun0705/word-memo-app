/**
 * 単語カードの型定義
 * Markdownコンテンツ、タグ、復習情報を持つ完全なカード
 */
export interface WordCard {
  id: string;
  title: string;
  content: string; // Markdown形式
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt?: Date;
  reviewCount: number;
  status: 'memo' | 'output'; // ステータス管理
  nextReviewDate?: Date; // 次回復習日
  easeFactor: number; // 難易度係数 (初期値 2.5)
  interval: number; // 復習間隔 (日)
  relatedCardIds: string[]; // 関連カードID
}

/**
 * 簡易単語カードの型定義
 * QuickAddで作成する簡易版カード
 */
export interface QuickWordCard {
  id: string;
  title: string;
  content?: string;
  tags?: string[];
  createdAt: Date;
}

/**
 * カード作成時の入力データ
 */
export interface CardInput {
  title: string;
  content: string;
  tags: string[];
  status?: 'memo' | 'output';
  easeFactor?: number;
  interval?: number;
  nextReviewDate?: Date;
  relatedCardIds?: string[];
}


/**
 * 検索・フィルタリングオプション
 */
export interface FilterOptions {
  searchQuery: string;
  selectedTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'reviewCount';
  sortOrder: 'asc' | 'desc';
}
