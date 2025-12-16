# Markdown単語メモアプリ

Markdownでメモできる単語帳アプリです。Next.js App RouterとFeatures Architectureを採用しています。

## 機能
- **単語カード管理**: 作成・編集・削除・一覧表示
- **Markdown対応**: リアルタイムプレビュー付きエディタ
- **タグ機能**: タグによる分類とフィルタリング
- **クイズモード**: 登録したカードで復習
- **QuickAdd**: 素早く単語を登録できるフローティングボタン
- **データ永続化**: LocalStorageを使用（MVP）

## ディレクトリ構成 (Features Architecture)

機能単位（Feature）でディレクトリを分割し、凝集度を高めています。

```
src/
├── app/                  # Next.js App Router Pages
│   ├── cards/            # カード関連ページ
│   ├── quiz/             # クイズページ
│   └── page.tsx          # ダッシュボード
├── features/             # 機能モジュール
│   ├── cards/            # カード管理機能
│   │   ├── components/   # カード関連UI (CardList, CardForm等)
│   │   ├── contexts/     # 状態管理 (CardContext)
│   │   └── types/        # 型定義
│   ├── quiz/             # クイズ機能
│   │   ├── components/   # クイズ関連UI (QuizCard)
│   │   └── types/        # 型定義
├── components/           # 共通コンポーネント
│   ├── ui/               # ShadCN UI Elements
│   ├── MarkdownEditor.tsx
│   ├── MarkdownPreview.tsx
│   └── TagInput.tsx
├── lib/                  # 共通ユーティリティ (storage, utils)
└── types/                # グローバル型定義（現在はfeaturesに移行済み）
```

## 技術スタック
- Framework: Next.js 16
- Language: TypeScript
- Styling: Tailwind CSS v4
- UI Library: ShadCN/UI
- Markdown: react-markdown

## 開発の始め方

```bash
npm install
npm run dev
```
