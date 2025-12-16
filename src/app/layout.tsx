
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { CardProvider } from '@/features/cards/contexts/CardContext';
import { QuickAddButton } from '@/features/cards/components/QuickAddButton';
import { SiteHeader } from '@/components/SiteHeader';
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
    <html lang="ja" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <CardProvider>
          <SiteHeader />

          {/* メインコンテンツ */}
          <main className="container mx-auto py-6 px-4 md:px-6">
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
