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
