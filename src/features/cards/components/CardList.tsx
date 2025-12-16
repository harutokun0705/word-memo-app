'use client';

import Link from 'next/link';
import { Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCards } from '../contexts/CardContext';
import { FilterOptions } from '../types';

/**
 * カード一覧コンポーネント
 * 検索、フィルタリング、ソート機能付き
 */
export function CardList() {
  const { filteredCards, filterOptions, setFilterOptions, allTags } = useCards();

  const handleSearchChange = (query: string) => {
    setFilterOptions(prev => ({ ...prev, searchQuery: query }));
  };

  const toggleTag = (tag: string) => {
    setFilterOptions(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const toggleSortOrder = () => {
    setFilterOptions(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const changeSortBy = (sortBy: FilterOptions['sortBy']) => {
    setFilterOptions(prev => ({ ...prev, sortBy }));
  };

  return (
    <div className="space-y-6">
      {/* 検索バー */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="検索..."
            value={filterOptions.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* ソートボタン */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="flex items-center gap-1"
          >
            {filterOptions.sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <select
            value={filterOptions.sortBy}
            onChange={(e) => changeSortBy(e.target.value as FilterOptions['sortBy'])}
            className="border rounded-md px-3 py-1 text-sm bg-background"
          >
            <option value="updatedAt">更新日</option>
            <option value="createdAt">作成日</option>
            <option value="title">タイトル</option>
            <option value="reviewCount">復習回数</option>
          </select>
        </div>
      </div>

      {/* タグフィルター */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={filterOptions.selectedTags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {filterOptions.selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterOptions(prev => ({ ...prev, selectedTags: [] }))}
            >
              クリア
            </Button>
          )}
        </div>
      )}

      {/* カード一覧 */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>カードがありません</p>
          <Link href="/cards/new">
            <Button className="mt-4">最初のカードを作成</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map(card => (
            <Link key={card.id} href={`/cards/${card.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{card.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {card.content.slice(0, 100)}
                    {card.content.length > 100 && '...'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {card.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{card.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    復習: {card.reviewCount}回
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
