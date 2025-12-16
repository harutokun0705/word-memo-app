'use client';

import Link from 'next/link';
import { Plus, Brain, Terminal, Zap, Check, ThumbsUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardList } from '@/features/cards/components/CardList';
import { ContributionGraph } from '@/components/ContributionGraph';
import { useCards } from '@/features/cards/contexts/CardContext';
import { isReviewNeeded, calculateNextReview, ReviewGrade } from '@/lib/spacedRepetition';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * ダッシュボード（ホーム）ページ
 * カード一覧と統計情報を表示
 */
export default function DashboardPage() {
  const { cards, updateCard } = useCards();

  // 復習が必要なカードを抽出
  const reviewCards = cards.filter(card => isReviewNeeded(card));

  // 復習処理
  const handleReview = (id: string, grade: ReviewGrade) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    const updated = calculateNextReview(card, grade);
    updateCard(id, updated);
  };

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
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)] transition-all">
                <Plus className="h-5 w-5 mr-2" />
                Create Card
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Review Section (Shows if there are cards to review) */}
      {reviewCards.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight flex items-center">
              <span className="w-2 h-8 bg-orange-500 rounded-full mr-4" />
              Review Needed
              <Badge variant="secondary" className="ml-3 bg-orange-500/10 text-orange-500 border-orange-500/20">
                {reviewCards.length}
              </Badge>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewCards.slice(0, 3).map(card => (
              <Card key={card.id} className="border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-mono text-foreground">{card.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Rev: {card.reviewCount}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {card.content.replace(/[#*`]/g, '')}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-500/30 hover:bg-red-500/10 hover:text-red-500 text-xs"
                    onClick={() => handleReview(card.id, 3)} // Hard
                  >
                    Hard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-500 text-xs"
                    onClick={() => handleReview(card.id, 4)} // Good
                  >
                    Good
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-green-500/30 hover:bg-green-500/10 hover:text-green-500 text-xs"
                    onClick={() => handleReview(card.id, 5)} // Easy
                  >
                    Easy
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {reviewCards.length > 3 && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              +{reviewCards.length - 3} more cards to review
            </p>
          )}
        </div>
      )}

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

        {/* Output Count - Small Square (New) */}
        <div className="md:col-span-1 lg:col-span-1 rounded-3xl bg-card border border-white/5 p-6 flex flex-col justify-center hover:border-green-500/50 transition-colors group">
           <div className="text-3xl font-mono font-bold text-foreground mb-1 group-hover:text-green-400 transition-colors">
            {cards.filter(card => card.status === 'output').length}
          </div>
          <div className="text-sm text-muted-foreground">Output Status</div>
        </div>

        {/* Quick Action / Promotion - Wide */}
        <div className="md:col-span-2 lg:col-span-2 rounded-3xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 p-6 flex items-center justify-between group cursor-pointer hover:bg-primary/20 transition-colors">
          <div>
             <h3 className="text-lg font-bold text-primary mb-1">Daily Streak</h3>
             <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Keep learning every day!</p>
          </div>
          <Button size="icon" className="rounded-full bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
             <Zap className="h-5 w-5" />
          </Button>
        </div>

      {/* Contribution Graph */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center">
          <span className="w-2 h-6 bg-primary rounded-full mr-3" />
          Activity Log
        </h2>
        <div className="p-6 rounded-3xl bg-card border border-white/5">
          <ContributionGraph />
        </div>
      </div>
      </div>

      {/* Card List Section */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center">
          <span className="w-2 h-8 bg-primary rounded-full mr-4" />
          All Cards
        </h2>
        <CardList />
      </div>
    </div>
  );
}
