'use client';

import { useState } from 'react';
import { Search, Plus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCards } from '../contexts/CardContext';
import { WordCard } from '../types';

interface RelationSelectorProps {
  currentCardId?: string; // Edit mode: exclude self
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function RelationSelector({ currentCardId, selectedIds, onSelectionChange }: RelationSelectorProps) {
  const { cards } = useCards();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Exclude current card and already selected cards from suggestion list
  const availableCards = cards.filter(card => 
    card.id !== currentCardId && 
    (searchQuery === '' || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      card.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (id: string, e: React.MouseEvent) => {
    // Prevent default to disable card expansion if nested in other card components
    e.preventDefault();
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(sId => sId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const selectedCardsData = cards.filter(card => selectedIds.includes(card.id));

  return (
    <div className="space-y-3">
      {/* Selected Cards List (Chips) */}
      <div className="flex flex-wrap gap-2">
        {selectedCardsData.map(card => (
          <Badge key={card.id} variant="secondary" className="pl-2 pr-1 py-1 h-auto text-sm border-primary/20 bg-primary/5 text-primary">
            {card.title}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent hover:text-destructive"
              onClick={() => onSelectionChange(selectedIds.filter(id => id !== card.id))}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 border-dashed border-primary/30 text-muted-foreground hover:text-primary hover:border-primary">
              <Plus className="h-3 w-3 mr-1" />
              関連カードを追加
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>関連カードを選択</DialogTitle>
            </DialogHeader>
            
            <div className="relative my-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="カードを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="flex-1 min-h-[300px] pr-4">
              <div className="space-y-2">
                {availableCards.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    カードが見つかりません
                  </p>
                ) : (
                  availableCards.map(card => {
                    const isSelected = selectedIds.includes(card.id);
                    return (
                      <div
                        key={card.id}
                        className={`
                          flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
                          ${isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:bg-accent/50'}
                        `}
                        onClick={(e) => handleSelect(card.id, e)}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="text-sm font-medium truncate text-foreground">{card.title}</div>
                          <div className="text-xs text-muted-foreground truncate opacity-70">
                            {card.tags.join(', ')}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
