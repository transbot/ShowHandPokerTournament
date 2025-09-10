import { Language, HandType } from './types';

export const translations = {
  zh: {
    title: '人机梭哈对战',
    player: '玩家',
    dealer: '庄家',
    yourCards: '您的手牌',
    dealerCards: '庄家手牌',
    selectCardsToReplace: '选择要换的牌（最多3张）',
    selectedCards: '已选择',
    replaceCards: '换牌',
    dealNewGame: '开始新游戏',
    continue: '继续游戏',
    gameOver: '游戏结束',
    result: '结果',
    playerWins: '玩家获胜！',
    dealerWins: '庄家获胜！',
    tie: '平局！',
    stats: '统计',
    totalGames: '总局数',
    wins: '获胜',
    losses: '失败',
    ties: '平局',
    winRate: '胜率',
    language: '语言',
    waiting: '等待换牌...',
    dealerReplacing: '庄家换牌中...',
    comparing: '比较中...',
    dealerReplaced: '庄家换牌',
    cards: '张',
    gameRules: '游戏规则',
    dealing: '发牌中...',
    playerReplacing: '换牌中...',
    replaceHint: '选择要换的牌（最多3张），然后点击换牌按钮开始游戏',
    continueHint: '点击"继续游戏"不换牌直接开始，或者点击牌面来换牌（最多三张）',
    handTypes: {
      'straight-flush': '同花顺',
      'four-of-a-kind': '四条',
      'full-house': '葫芦',
      'flush': '同花',
      'straight': '顺子',
      'three-of-a-kind': '三条',
      'two-pairs': '两对',
      'one-pair': '一对',
      'high-card': '散牌'
    }
  },
  en: {
    title: 'Human vs AI ShowHand',
    player: 'Player',
    dealer: 'Dealer',
    yourCards: 'Your Cards',
    dealerCards: 'Dealer Cards',
    selectCardsToReplace: 'Select cards to replace (max 3)',
    selectedCards: 'Selected',
    replaceCards: 'Replace Cards',
    dealNewGame: 'Deal New Game',
    continue: 'Continue Game',
    gameOver: 'Game Over',
    result: 'Result',
    playerWins: 'Player Wins!',
    dealerWins: 'Dealer Wins!',
    tie: 'Tie!',
    stats: 'Statistics',
    totalGames: 'Total Games',
    wins: 'Wins',
    losses: 'Losses',
    ties: 'Ties',
    winRate: 'Win Rate',
    language: 'Language',
    waiting: 'Waiting to replace cards...',
    dealerReplacing: 'Dealer replacing cards...',
    comparing: 'Comparing hands...',
    dealerReplaced: 'Dealer replaced',
    cards: 'cards',
    gameRules: 'Game Rules',
    dealing: 'Dealing cards...',
    playerReplacing: 'Replacing cards...',
    replaceHint: 'Select cards to replace (max 3), then click replace button to start',
    continueHint: 'Click "Continue Game" to start without replacing cards, or click card faces to replace cards (max 3)',
    handTypes: {
      'straight-flush': 'Straight Flush',
      'four-of-a-kind': 'Four of a Kind',
      'full-house': 'Full House',
      'flush': 'Flush',
      'straight': 'Straight',
      'three-of-a-kind': 'Three of a Kind',
      'two-pairs': 'Two Pairs',
      'one-pair': 'One Pair',
      'high-card': 'High Card'
    }
  }
};

export const getTranslation = (key: string, language: Language): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  for (const k of keys) {
    value = value[k];
  }
  return value || key;
};