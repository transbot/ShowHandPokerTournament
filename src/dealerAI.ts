import { Card, HandEvaluation } from './types';
import { evaluateHand, createDeck, shuffleDeck } from './gameLogic';

// 庄家AI换牌策略
export const getDealerCardReplacement = (hand: Card[], deck: Card[]): number[] => {
  const currentEval = evaluateHand(hand);
  
  // 如果已经是很好的牌型，不换牌
  if (currentEval.type === 'straight-flush' || 
      currentEval.type === 'four-of-a-kind' || 
      currentEval.type === 'full-house') {
    return [];
  }
  
  // 如果是同花或顺子，根据情况决定
  if (currentEval.type === 'flush' || currentEval.type === 'straight') {
    // 比较强的同花或顺子不换牌
    if (currentEval.score > (currentEval.type === 'flush' ? 5500000 : 4000010)) {
      return [];
    }
  }
  
  // 如果是三条，保留三条，换其他两张
  if (currentEval.type === 'three-of-a-kind') {
    const rankCounts = new Map<string, number>();
    hand.forEach(card => {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
    });
    
    const threeOfAKindRank = Array.from(rankCounts.entries())
      .find(([, count]) => count === 3)?.[0];
    
    return hand
      .map((card, index) => card.rank !== threeOfAKindRank ? index : -1)
      .filter(index => index !== -1);
  }
  
  // 如果是两对，保留两对，换单张
  if (currentEval.type === 'two-pairs') {
    const rankCounts = new Map<string, number>();
    hand.forEach(card => {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
    });
    
    const singleCardRank = Array.from(rankCounts.entries())
      .find(([, count]) => count === 1)?.[0];
    
    return hand
      .map((card, index) => card.rank === singleCardRank ? index : -1)
      .filter(index => index !== -1);
  }
  
  // 如果是一对，保留对子，考虑换其他牌
  if (currentEval.type === 'one-pair') {
    const rankCounts = new Map<string, number>();
    hand.forEach(card => {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
    });
    
    const pairRank = Array.from(rankCounts.entries())
      .find(([, count]) => count === 2)?.[0];
    
    const nonPairIndices = hand
      .map((card, index) => card.rank !== pairRank ? index : -1)
      .filter(index => index !== -1);
    
    // 保留高牌，换低牌
    const nonPairCards = nonPairIndices.map(i => ({ card: hand[i], index: i }));
    nonPairCards.sort((a, b) => {
      const aVal = a.card.rank === 'A' ? 14 : 
                  a.card.rank === 'K' ? 13 :
                  a.card.rank === 'Q' ? 12 :
                  a.card.rank === 'J' ? 11 : parseInt(a.card.rank);
      const bVal = b.card.rank === 'A' ? 14 : 
                  b.card.rank === 'K' ? 13 :
                  b.card.rank === 'Q' ? 12 :
                  b.card.rank === 'J' ? 11 : parseInt(b.card.rank);
      return aVal - bVal;
    });
    
    // 换掉最小的两张
    return nonPairCards.slice(0, 2).map(item => item.index);
  }
  
  // 散牌情况：尝试找到最佳换牌策略
  return getBestReplacementForHighCard(hand, deck);
};

// 为散牌找到最佳换牌策略
const getBestReplacementForHighCard = (hand: Card[], deck: Card[]): number[] => {
  // 检查是否接近同花
  const suitCounts = new Map<string, number>();
  hand.forEach(card => {
    suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1);
  });
  
  const maxSuitCount = Math.max(...suitCounts.values());
  if (maxSuitCount === 4) {
    // 有4张同花色，换掉不同色的那张
    const flushSuit = Array.from(suitCounts.entries())
      .find(([, count]) => count === 4)?.[0];
    
    return hand
      .map((card, index) => card.suit !== flushSuit ? index : -1)
      .filter(index => index !== -1);
  }
  
  // 检查是否接近顺子
  const straightDraw = checkStraightDraw(hand);
  if (straightDraw.length > 0) {
    return straightDraw;
  }
  
  // 保留最大的两张牌，换掉其他的
  const sortedCards = hand
    .map((card, index) => ({ card, index }))
    .sort((a, b) => {
      const aVal = a.card.rank === 'A' ? 14 : 
                  a.card.rank === 'K' ? 13 :
                  a.card.rank === 'Q' ? 12 :
                  a.card.rank === 'J' ? 11 : parseInt(a.card.rank);
      const bVal = b.card.rank === 'A' ? 14 : 
                  b.card.rank === 'K' ? 13 :
                  b.card.rank === 'Q' ? 12 :
                  b.card.rank === 'J' ? 11 : parseInt(b.card.rank);
      return bVal - aVal;
    });
  
  return sortedCards.slice(2).map(item => item.index);
};

// 检查是否有顺子听牌
const checkStraightDraw = (hand: Card[]): number[] => {
  const values = hand.map(card => {
    const rank = card.rank;
    return rank === 'A' ? 14 : 
           rank === 'K' ? 13 :
           rank === 'Q' ? 12 :
           rank === 'J' ? 11 : parseInt(rank);
  }).sort((a, b) => a - b);
  
  // 简化的顺子听牌检测
  const gaps = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i] - values[i-1] > 1) {
      gaps.push(i);
    }
  }
  
  // 如果只有一个间隔且间隔不大，可能是听牌
  if (gaps.length === 1 && values[4] - values[0] <= 6) {
    // 这是一个简化的实现，实际情况更复杂
    return [];
  }
  
  return [];
};