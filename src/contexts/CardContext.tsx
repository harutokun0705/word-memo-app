'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WordCard, CardInput, FilterOptions } from '@/types';
import { saveCards, loadCards, getSampleCards } from '@/lib/storage';

interface CardContextType {
  // カード一覧
  cards: WordCard[];
  filteredCards: WordCard[];
  
  // フィルターオプション
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  
  // CRUD操作
  addCard: (input: CardInput) => WordCard;
  updateCard: (id: string, input: Partial<CardInput>) => void;
  deleteCard: (id: string) => void;
  getCardById: (id: string) => WordCard | undefined;
  
  // クイズ関連
  markAsReviewed: (id: string) => void;
  getRandomCard: () => WordCard | undefined;
  
  // タグ一覧
  allTags: string[];
}

const CardContext = createContext<CardContextType | undefined>(undefined);

const defaultFilterOptions: FilterOptions = {
  searchQuery: '',
  selectedTags: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc',
};

export function CardProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化時にLocalStorageからカードを読み込む
  useEffect(() => {
    const loadedCards = loadCards();
    if (loadedCards.length === 0) {
      // サンプルデータを追加
      const sampleCards = getSampleCards();
      setCards(sampleCards);
      saveCards(sampleCards);
    } else {
      setCards(loadedCards);
    }
    setIsInitialized(true);
  }, []);

  // カードが変更されたらLocalStorageに保存
  useEffect(() => {
    if (isInitialized) {
      saveCards(cards);
    }
  }, [cards, isInitialized]);

  // 全タグの取得
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    cards.forEach(card => card.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [cards]);

  // フィルタリング・ソート済みカード
  const filteredCards = useMemo(() => {
    let result = [...cards];

    // 検索クエリによるフィルタリング
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      result = result.filter(card =>
        card.title.toLowerCase().includes(query) ||
        card.content.toLowerCase().includes(query)
      );
    }

    // タグによるフィルタリング
    if (filterOptions.selectedTags.length > 0) {
      result = result.filter(card =>
        filterOptions.selectedTags.some(tag => card.tags.includes(tag))
      );
    }

    // ソート
    result.sort((a, b) => {
      let comparison = 0;
      switch (filterOptions.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updatedAt':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'reviewCount':
          comparison = a.reviewCount - b.reviewCount;
          break;
      }
      return filterOptions.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [cards, filterOptions]);

  // カード追加
  const addCard = useCallback((input: CardInput): WordCard => {
    const now = new Date();
    const newCard: WordCard = {
      id: uuidv4(),
      title: input.title,
      content: input.content,
      tags: input.tags,
      createdAt: now,
      updatedAt: now,
      reviewCount: 0,
    };
    setCards(prev => [...prev, newCard]);
    return newCard;
  }, []);

  // カード更新
  const updateCard = useCallback((id: string, input: Partial<CardInput>) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id
          ? {
              ...card,
              ...input,
              updatedAt: new Date(),
            }
          : card
      )
    );
  }, []);

  // カード削除
  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  }, []);

  // ID指定でカード取得
  const getCardById = useCallback((id: string): WordCard | undefined => {
    return cards.find(card => card.id === id);
  }, [cards]);

  // 復習済みマーク
  const markAsReviewed = useCallback((id: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id
          ? {
              ...card,
              lastReviewedAt: new Date(),
              reviewCount: card.reviewCount + 1,
            }
          : card
      )
    );
  }, []);

  // ランダムカード取得
  const getRandomCard = useCallback((): WordCard | undefined => {
    if (cards.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }, [cards]);

  const value: CardContextType = {
    cards,
    filteredCards,
    filterOptions,
    setFilterOptions,
    addCard,
    updateCard,
    deleteCard,
    getCardById,
    markAsReviewed,
    getRandomCard,
    allTags,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

export function useCards() {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
}
