// 游戏相关类型定义
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export type HandType = 
  | 'straight-flush'
  | 'four-of-a-kind' 
  | 'full-house'
  | 'flush'
  | 'straight'
  | 'three-of-a-kind'
  | 'two-pairs'
  | 'one-pair'
  | 'high-card';

export interface HandEvaluation {
  type: HandType;
  score: number;
  highCards: number[];
}

export interface GameStats {
  totalGames: number;
  playerWins: number;
  dealerWins: number;
  ties: number;
}

export type Language = 'zh' | 'en';