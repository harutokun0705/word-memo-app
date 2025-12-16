/**
 * クイズの回答結果
 */
export interface QuizResult {
  cardId: string;
  isCorrect: boolean;
  answeredAt: Date;
}
