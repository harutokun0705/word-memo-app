import { WordCard } from '@/features/cards/types';

const STORAGE_KEY = 'word-memo-cards';

/**
 * LocalStorageにカード配列を保存
 */
export function saveCards(cards: WordCard[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

/**
 * LocalStorageからカード配列を取得
 */
export function loadCards(): WordCard[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    const cards = JSON.parse(data);
    // Date型の復元
    return cards.map((card: WordCard) => ({
      ...card,
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
      lastReviewedAt: card.lastReviewedAt ? new Date(card.lastReviewedAt) : undefined,
      nextReviewDate: card.nextReviewDate ? new Date(card.nextReviewDate) : undefined,
      // 新しいフィールドの初期値設定（既存データ移行用）
      status: card.status || 'memo',
      easeFactor: card.easeFactor || 2.5,
      interval: card.interval || 0,
      relatedCardIds: card.relatedCardIds || [],
    }));
  } catch {
    return [];
  }
}

/**
 * サンプルデータを生成
 */
export function getSampleCards(): WordCard[] {
  const now = new Date();
  return [
    {
      id: 'sample-1',
      title: 'React',
      content: `# React

Facebookが開発したJavaScriptライブラリ。

## 特徴
- **宣言的UI**: 状態に基づいてUIを自動更新
- **コンポーネントベース**: 再利用可能なUI部品
- **Virtual DOM**: 効率的なDOM更新

\`\`\`jsx
function Hello({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`
`,
      tags: ['JavaScript', 'フロントエンド', 'ライブラリ'],
      createdAt: now,
      updatedAt: now,
      reviewCount: 0,
      status: 'memo',
      easeFactor: 2.5,
      interval: 0,
      relatedCardIds: [],
    },
    {
      id: 'sample-2',
      title: 'TypeScript',
      content: `# TypeScript

Microsoftが開発したJavaScriptのスーパーセット。

## 特徴
- **静的型付け**: コンパイル時に型チェック
- **型推論**: 自動で型を推論
- **IDE対応**: 強力なオートコンプリート

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`
`,
      tags: ['JavaScript', 'TypeScript', '型システム'],
      createdAt: now,
      updatedAt: now,
      reviewCount: 0,
      status: 'output',
      easeFactor: 2.5,
      interval: 0,
      relatedCardIds: [],
    },
  ];
}
