'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, Eye, EyeOff, Check, X, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { useCards } from '@/features/cards/contexts/CardContext';
import { WordCard } from '@/features/cards/types';

type QuizMode = 'title' | 'content';

/**
 * クイズカードコンポーネント
 * タイトルまたは内容を隠して回答
 */
export function QuizCard() {
  const { cards, getRandomCard, markAsReviewed } = useCards();
  const [currentCard, setCurrentCard] = useState<WordCard | undefined>();
  const [isRevealed, setIsRevealed] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode>('title');
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  // 次の問題へ
  const nextQuestion = useCallback(() => {
    const card = getRandomCard();
    setCurrentCard(card);
    setIsRevealed(false);
    setUserAnswer('');
    setResult(null);
  }, [getRandomCard]);

  // 回答を確認
  const checkAnswer = useCallback(() => {
    if (!currentCard) return;
    
    const answer = userAnswer.trim().toLowerCase();
    const correct = currentCard.title.toLowerCase();
    
    // 単純な文字列比較（部分一致も許容）
    const isCorrect = answer === correct || correct.includes(answer) || answer.includes(correct);
    
    setResult(isCorrect ? 'correct' : 'incorrect');
    markAsReviewed(currentCard.id);
  }, [currentCard, userAnswer, markAsReviewed]);

  // 答えを見る
  const revealAnswer = useCallback(() => {
    setIsRevealed(true);
    if (currentCard) {
      markAsReviewed(currentCard.id);
    }
  }, [currentCard, markAsReviewed]);

  // クイズモード切り替え
  const toggleQuizMode = () => {
    setQuizMode(prev => prev === 'title' ? 'content' : 'title');
    nextQuestion();
  };

  if (cards.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>クイズを開始するにはカードを追加してください</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentCard) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">クイズモード</h2>
          <p className="text-muted-foreground mb-6">
            {cards.length}枚のカードが登録されています
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              variant={quizMode === 'title' ? 'default' : 'outline'}
              onClick={() => setQuizMode('title')}
            >
              タイトルを当てる
            </Button>
            <Button
              variant={quizMode === 'content' ? 'default' : 'outline'}
              onClick={() => setQuizMode('content')}
            >
              内容を当てる
            </Button>
          </div>
          
          <Button size="lg" onClick={nextQuestion}>
            クイズ開始
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {quizMode === 'title' ? '単語名を答えて！' : '意味を確認！'}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={toggleQuizMode}>
            <RefreshCw className="h-4 w-4 mr-1" />
            モード切替
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 問題表示 */}
        {quizMode === 'title' ? (
          // タイトルを隠す場合は内容を表示
          <div className="bg-muted/50 p-4 rounded-lg min-h-[200px]">
            <MarkdownPreview content={currentCard.content} />
          </div>
        ) : (
          // 内容を隠す場合はタイトルを表示
          <div className="text-center py-8">
            <h3 className="text-3xl font-bold">{currentCard.title}</h3>
            <div className="flex flex-wrap gap-1 justify-center mt-4">
              {currentCard.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* 回答入力（タイトルを当てる場合のみ） */}
        {quizMode === 'title' && !isRevealed && result === null && (
          <div className="space-y-4">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="答えを入力..."
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
            <div className="flex gap-2 justify-center">
              <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                <Check className="h-4 w-4 mr-1" />
                回答
              </Button>
              <Button variant="outline" onClick={revealAnswer}>
                <Eye className="h-4 w-4 mr-1" />
                答えを見る
              </Button>
            </div>
          </div>
        )}

        {/* 結果表示 */}
        {result && (
          <div className={`text-center p-4 rounded-lg ${
            result === 'correct' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}>
            {result === 'correct' ? (
              <p className="text-green-700 dark:text-green-300 font-bold">正解！🎉</p>
            ) : (
              <p className="text-red-700 dark:text-red-300 font-bold">
                不正解... 正解は「{currentCard.title}」
              </p>
            )}
          </div>
        )}

        {/* 答え表示(内容モード、またはreveal時) */}
        {(quizMode === 'content' || isRevealed) && (
          <div className="space-y-4">
            {quizMode === 'title' && isRevealed && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">{currentCard.title}</h3>
              </div>
            )}
            {quizMode === 'content' && (
              <>
                {!isRevealed ? (
                  <div className="flex justify-center">
                    <Button onClick={revealAnswer}>
                      <Eye className="h-4 w-4 mr-2" />
                      答えを見る
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <MarkdownPreview content={currentCard.content} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={nextQuestion}>
          <SkipForward className="h-4 w-4 mr-1" />
          スキップ
        </Button>
        <Button onClick={nextQuestion}>
          次の問題
        </Button>
      </CardFooter>
    </Card>
  );
}
