'use client';

import Link from 'next/link';
import { Plus, Brain, Terminal, Zap } from 'lucide-react';
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
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background via-background to-primary/5 border border-white/10 p-6 md:p-12">
        <div className="absolute top-0 right-0 -m-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl mb-4">
            Master your <span className="text-primary">Tech Stack</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Efficiently manage your technical vocabulary. Memoize, tag, and review your knowledge with our intelligent flashcard system.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/cards/new">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 shadow-[0_0_20px_rgba(184,255,51,0.3)] hover:shadow-[0_0_30px_rgba(184,255,51,0.5)] transition-all">
                <Plus className="h-5 w-5 mr-2" />
                Create Card
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 bg-black/20 backdrop-blur-sm">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                Start Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Cards - Large Square */}
        <div className="md:col-span-1 lg:col-span-1 row-span-2 rounded-3xl bg-card border border-white/5 p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Terminal className="h-24 w-24 text-primary" />
          </div>
          <div className="relative h-full flex flex-col justify-end">
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Cards</div>
            <div className="text-5xl font-mono font-bold text-foreground">{cards.length}</div>
          </div>
        </div>

        {/* Reviews - Wide Rectangle */}
        <div className="md:col-span-2 lg:col-span-2 rounded-3xl bg-card border border-white/5 p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute -right-4 -top-4 h-32 w-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex justify-between items-end relative z-10">
            <div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Reviews</div>
              <div className="text-4xl font-mono font-bold text-foreground">
                {cards.reduce((acc, card) => acc + card.reviewCount, 0)}
              </div>
            </div>
            <div className="h-12 w-24 flex items-end justify-end gap-1">
               {/* Simple visual graph bars */}
               <div className="w-2 h-4 bg-primary/20 rounded-t-sm" />
               <div className="w-2 h-6 bg-primary/40 rounded-t-sm" />
               <div className="w-2 h-3 bg-primary/30 rounded-t-sm" />
               <div className="w-2 h-8 bg-primary rounded-t-sm" />
               <div className="w-2 h-5 bg-primary/50 rounded-t-sm" />
            </div>
          </div>
        </div>

        {/* Tags - Small Square */}
        <div className="md:col-span-1 lg:col-span-1 rounded-3xl bg-card border border-white/5 p-6 flex flex-col justify-center hover:border-purple-500/50 transition-colors group">
          <div className="text-3xl font-mono font-bold text-foreground mb-1 group-hover:text-purple-400 transition-colors">
            {new Set(cards.flatMap(card => card.tags)).size}
          </div>
          <div className="text-sm text-muted-foreground">Active Tags</div>
        </div>

        {/* Unreviewed - Small Square */}
        <div className="md:col-span-1 lg:col-span-1 rounded-3xl bg-card border border-white/5 p-6 flex flex-col justify-center hover:border-orange-500/50 transition-colors group">
           <div className="text-3xl font-mono font-bold text-foreground mb-1 group-hover:text-orange-400 transition-colors">
            {cards.filter(card => card.reviewCount === 0).length}
          </div>
          <div className="text-sm text-muted-foreground">Pending Review</div>
        </div>

        {/* Quick Action / Promotion - Wide */}
        <div className="md:col-span-2 lg:col-span-2 rounded-3xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 p-6 flex items-center justify-between group cursor-pointer hover:bg-primary/20 transition-colors">
          <div>
             <h3 className="text-lg font-bold text-primary mb-1">Weekly Challenge</h3>
             <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Review 10 cards to keep your streak!</p>
          </div>
          <Button size="icon" className="rounded-full bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
             <Zap className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Card List Section */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center">
          <span className="w-2 h-8 bg-primary rounded-full mr-4" />
          Recent Cards
        </h2>
        <CardList />
      </div>
    </div>
  );
}
