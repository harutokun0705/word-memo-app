
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { CardProvider } from '@/features/cards/contexts/CardContext';
import { QuickAddButton } from '@/features/cards/components/QuickAddButton';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Markdown単語メモ - IT用語学習アプリ",
  description: "IT・プログラミング用語をMarkdownでメモし、タグ付け・検索・クイズ形式で復習できるアプリ",
};

/**
 * アプリケーションのルートレイアウト
 * CardProviderでグローバル状態を管理
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <CardProvider>
          {/* ナビゲーションヘッダー */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  📚 Markdown単語メモ
                </span>
              </Link>
              <nav className="ml-auto flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  ホーム
                </Link>
                <Link 
                  href="/cards/new" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  新規作成
                </Link>
                <Link 
                  href="/quiz" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  クイズ
                </Link>
              </nav>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="container py-6">
            {children}
          </main>

          {/* フッター */}
          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            <p>Markdown単語メモアプリ - FE/BE エンジニア向け学習ツール</p>
          </footer>

          {/* QuickAddフローティングボタン */}
          <QuickAddButton />
        </CardProvider>
      </body>
    </html>
  );
}
