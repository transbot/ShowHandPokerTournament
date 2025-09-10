import { Card, Rank, Suit, HandType, HandEvaluation } from './types';

// 创建一副牌
export const createDeck = (): Card[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({
        suit,
        rank,
        id: `${suit}-${rank}`
      });
    });
  });

  return deck;
};

// 洗牌
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 获取牌的数值（用于比较，A=14）
export const getCardValue = (rank: Rank): number => {
  switch (rank) {
    case 'A': return 14;
    case 'K': return 13;
    case 'Q': return 12;
    case 'J': return 11;
    default: return parseInt(rank);
  }
};

// 获取牌的数值（A可以当1，用于A-2-3-4-5顺子）
export const getCardValueLowAce = (rank: Rank): number => {
  switch (rank) {
    case 'A': return 1;
    case 'K': return 13;
    case 'Q': return 12;
    case 'J': return 11;
    default: return parseInt(rank);
  }
};

// 判断是否为顺子
export const isStraight = (cards: Card[]): boolean => {
  const values = cards.map(card => getCardValue(card.rank)).sort((a, b) => a - b);
  const valuesLowAce = cards.map(card => getCardValueLowAce(card.rank)).sort((a, b) => a - b);
  
  // 检查常规顺子
  let isRegularStraight = true;
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1] + 1) {
      isRegularStraight = false;
      break;
    }
  }
  
  // 检查A-2-3-4-5顺子
  let isLowAceStraight = true;
  for (let i = 1; i < valuesLowAce.length; i++) {
    if (valuesLowAce[i] !== valuesLowAce[i - 1] + 1) {
      isLowAceStraight = false;
      break;
    }
  }
  
  return isRegularStraight || isLowAceStraight;
};

// 判断是否为同花
export const isFlush = (cards: Card[]): boolean => {
  const firstSuit = cards[0].suit;
  return cards.every(card => card.suit === firstSuit);
};

// 计算手牌点数组合
export const getRankCounts = (cards: Card[]): Map<Rank, number> => {
  const counts = new Map<Rank, number>();
  cards.forEach(card => {
    counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
  });
  return counts;
};

// 评估手牌类型（不计算分数）
export const evaluateHandType = (cards: Card[]): HandType => {
  const isFlushHand = isFlush(cards);
  const isStraightHand = isStraight(cards);
  const rankCounts = getRankCounts(cards);
  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);
  
  // 同花顺
  if (isFlushHand && isStraightHand) {
    return 'straight-flush';
  }
  
  // 四条
  if (counts[0] === 4) {
    return 'four-of-a-kind';
  }
  
  // 葫芦
  if (counts[0] === 3 && counts[1] === 2) {
    return 'full-house';
  }
  
  // 同花
  if (isFlushHand) {
    return 'flush';
  }
  
  // 顺子
  if (isStraightHand) {
    return 'straight';
  }
  
  // 三条
  if (counts[0] === 3) {
    return 'three-of-a-kind';
  }
  
  // 两对
  if (counts[0] === 2 && counts[1] === 2) {
    return 'two-pairs';
  }
  
  // 一对
  if (counts[0] === 2) {
    return 'one-pair';
  }
  
  // 散牌
  return 'high-card';
};

// 获取牌型权重
export const getHandWeight = (handType: HandType): number => {
  switch (handType) {
    case 'straight-flush': return 9;
    case 'four-of-a-kind': return 8;
    case 'full-house': return 7;
    case 'flush': return 6;
    case 'straight': return 5;
    case 'three-of-a-kind': return 4;
    case 'two-pairs': return 3;
    case 'one-pair': return 2;
    case 'high-card': return 1;
    default: return 0;
  }
};

// 获取排序后的牌面值（从大到小）
export const getSortedCardValues = (cards: Card[]): number[] => {
  const values = cards.map(card => getCardValue(card.rank));
  return values.sort((a, b) => b - a);
};

// 获取N张相同牌的值
export const getNOfAKindValue = (cards: Card[], n: number): number => {
  const rankCounts = getRankCounts(cards);
  
  for (const [rank, count] of rankCounts.entries()) {
    if (count === n) {
      return getCardValue(rank);
    }
  }
  
  return 0;
};

// 获取对子的值（用于两对，返回从大到小排序的数组）
export const getPairValues = (cards: Card[]): number[] => {
  const rankCounts = getRankCounts(cards);
  const pairs: number[] = [];
  
  for (const [rank, count] of rankCounts.entries()) {
    if (count === 2) {
      pairs.push(getCardValue(rank));
    }
  }
  
  return pairs.sort((a, b) => b - a);
};

// 获取单张牌的值（用于两对）
export const getSingleCardValue = (cards: Card[]): number => {
  const rankCounts = getRankCounts(cards);
  
  for (const [rank, count] of rankCounts.entries()) {
    if (count === 1) {
      return getCardValue(rank);
    }
  }
  
  return 0;
};

// 比较最高牌
export const compareHighCard = (values1: number[], values2: number[]): number => {
  for (let i = 0; i < values1.length; i++) {
    if (values1[i] > values2[i]) {
      return 1;
    } else if (values2[i] > values1[i]) {
      return -1;
    }
  }
  return 0;
};

// 比较相同牌型的两手牌
export const compareSameTypeHands = (hand1: Card[], hand2: Card[]): number => {
  const handType = evaluateHandType(hand1);
  const values1 = getSortedCardValues(hand1);
  const values2 = getSortedCardValues(hand2);
  
  switch (handType) {
    case 'straight-flush':
    case 'straight':
    case 'flush':
    case 'high-card':
      return compareHighCard(values1, values2);
      
    case 'four-of-a-kind': {
      const four1 = getNOfAKindValue(hand1, 4);
      const four2 = getNOfAKindValue(hand2, 4);
      
      if (four1 > four2) return 1;
      if (four2 > four1) return -1;
      
      // 四条相同，比较单张
      const single1 = getNOfAKindValue(hand1, 1);
      const single2 = getNOfAKindValue(hand2, 1);
      
      if (single1 > single2) return 1;
      if (single2 > single1) return -1;
      return 0;
    }
    
    case 'full-house': {
      const three1 = getNOfAKindValue(hand1, 3);
      const three2 = getNOfAKindValue(hand2, 3);
      
      if (three1 > three2) return 1;
      if (three2 > three1) return -1;
      
      // 三条相同，比较对子
      const pair1 = getNOfAKindValue(hand1, 2);
      const pair2 = getNOfAKindValue(hand2, 2);
      
      if (pair1 > pair2) return 1;
      if (pair2 > pair1) return -1;
      return 0;
    }
    
    case 'three-of-a-kind': {
      const three1 = getNOfAKindValue(hand1, 3);
      const three2 = getNOfAKindValue(hand2, 3);
      
      if (three1 > three2) return 1;
      if (three2 > three1) return -1;
      
      // 三条相同，比较剩余牌
      return compareHighCard(values1, values2);
    }
    
    case 'two-pairs': {
      const pairs1 = getPairValues(hand1);
      const pairs2 = getPairValues(hand2);
      
      // 比较高对
      if (pairs1[0] > pairs2[0]) return 1;
      if (pairs2[0] > pairs1[0]) return -1;
      
      // 高对相同，比较低对
      if (pairs1[1] > pairs2[1]) return 1;
      if (pairs2[1] > pairs1[1]) return -1;
      
      // 两对都相同，比较单张
      const single1 = getSingleCardValue(hand1);
      const single2 = getSingleCardValue(hand2);
      
      if (single1 > single2) return 1;
      if (single2 > single1) return -1;
      return 0;
    }
    
    case 'one-pair': {
      const pair1 = getNOfAKindValue(hand1, 2);
      const pair2 = getNOfAKindValue(hand2, 2);
      
      if (pair1 > pair2) return 1;
      if (pair2 > pair1) return -1;
      
      // 对子相同，比较剩余牌
      return compareHighCard(values1, values2);
    }
    
    default:
      return 0;
  }
};

// 评估手牌（包含类型和详细信息）
export const evaluateHand = (cards: Card[]): HandEvaluation => {
  const handType = evaluateHandType(cards);
  const cardValues = getSortedCardValues(cards);
  
  return {
    type: handType,
    score: getHandWeight(handType), // 简化为只使用权重
    highCards: cardValues
  };
};

// 比较两手牌
export const compareHands = (playerHand: Card[], dealerHand: Card[]): number => {
  const playerType = evaluateHandType(playerHand);
  const dealerType = evaluateHandType(dealerHand);
  
  const playerWeight = getHandWeight(playerType);
  const dealerWeight = getHandWeight(dealerType);
  
  console.log('Player hand:', playerHand.map(c => `${c.rank}${c.suit}`));
  console.log('Dealer hand:', dealerHand.map(c => `${c.rank}${c.suit}`));
  console.log('Player type:', playerType, 'weight:', playerWeight);
  console.log('Dealer type:', dealerType, 'weight:', dealerWeight);
  
  // 先比较牌型权重
  if (playerWeight > dealerWeight) {
    console.log('Player wins by hand type');
    return 1;
  } else if (dealerWeight > playerWeight) {
    console.log('Dealer wins by hand type');
    return -1;
  } else {
    // 牌型相同，比较具体牌面
    const result = compareSameTypeHands(playerHand, dealerHand);
    console.log('Same hand type, detailed comparison result:', result);
    return result;
  }
};