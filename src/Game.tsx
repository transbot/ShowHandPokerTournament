import React, { useState, useEffect } from 'react';
import { Card, GameStats, Language, HandEvaluation } from './types';
import { createDeck, shuffleDeck, compareHands, evaluateHand } from './gameLogic';
import { getDealerCardReplacement } from './dealerAI';
import { Hand } from './components/Hand';
import { GameStats as GameStatsComponent } from './components/GameStats';
import { getTranslation } from './translations';
import { Globe, Play, RotateCcw, Sun, Moon, RefreshCw } from 'lucide-react';

type GamePhase = 'dealing' | 'player-replace' | 'dealer-replace' | 'revealing' | 'game-over';

export const Game: React.FC = () => {
  // 根据用户系统环境自动设置语言
  const getSystemLanguage = (): Language => {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  };
  
  const [language, setLanguage] = useState<Language>(getSystemLanguage());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('dealing');
  const [gameResult, setGameResult] = useState<string>('');
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    playerWins: 0,
    dealerWins: 0,
    ties: 0
  });
  const [playerEvaluation, setPlayerEvaluation] = useState<HandEvaluation | null>(null);
  const [dealerEvaluation, setDealerEvaluation] = useState<HandEvaluation | null>(null);
  const [dealerReplacedCount, setDealerReplacedCount] = useState<number>(0);

  // 开始新游戏
  const startNewGame = () => {
    const newDeck = shuffleDeck(createDeck());
    const newPlayerHand = newDeck.slice(0, 5);
    const newDealerHand = newDeck.slice(5, 10);
    
    setDeck(newDeck.slice(10));
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setSelectedCards([]);
    setGamePhase('player-replace');
    setGameResult('');
    setPlayerEvaluation(null);
    setDealerEvaluation(null);
    setDealerReplacedCount(0);
  };

  // 重置游戏统计
  const resetGame = () => {
    setStats({
      totalGames: 0,
      playerWins: 0,
      dealerWins: 0,
      ties: 0
    });
    startNewGame();
  };

  // 处理玩家选择牌
  const handleCardClick = (index: number) => {
    if (gamePhase !== 'player-replace') return;
    
    setSelectedCards(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else if (prev.length < 3) {
        return [...prev, index];
      }
      return prev;
    });
  };

  // 玩家换牌
  const replacePlayerCards = () => {
    if (selectedCards.length === 0) {
      // 玩家选择不换牌，直接进入庄家阶段
      setGamePhase('dealer-replace');
      handleDealerReplace();
      return;
    }

    const newPlayerHand = [...playerHand];
    const newDeck = [...deck];
    
    selectedCards.forEach(index => {
      newPlayerHand[index] = newDeck.shift()!;
    });
    
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    setSelectedCards([]);
    setGamePhase('dealer-replace');
    
    // 延迟处理庄家换牌，给用户一些反馈时间
    setTimeout(() => {
      handleDealerReplace(newDeck, newPlayerHand);
    }, 1000);
  };

  // 庄家换牌
  const handleDealerReplace = (currentDeck?: Card[], currentPlayerHand?: Card[]) => {
    const workingDeck = currentDeck || deck;
    const workingPlayerHand = currentPlayerHand || playerHand;
    
    const dealerReplaceIndices = getDealerCardReplacement(dealerHand, workingDeck);
    
    setDealerReplacedCount(dealerReplaceIndices.length);
    
    if (dealerReplaceIndices.length === 0) {
      // 庄家不换牌
      setTimeout(() => {
        revealAndCompare(workingPlayerHand, dealerHand);
      }, 1500);
      return;
    }
    
    const newDealerHand = [...dealerHand];
    const newDeck = [...workingDeck];
    
    dealerReplaceIndices.forEach(index => {
      newDealerHand[index] = newDeck.shift()!;
    });
    
    setDealerHand(newDealerHand);
    setDeck(newDeck);
    
    // 延迟显示结果
    setTimeout(() => {
      revealAndCompare(workingPlayerHand, newDealerHand);
    }, 1500);
  };

  // 比较并显示结果
  const revealAndCompare = (finalPlayerHand: Card[], finalDealerHand: Card[]) => {
    const playerEval = evaluateHand(finalPlayerHand);
    const dealerEval = evaluateHand(finalDealerHand);
    
    setPlayerEvaluation(playerEval);
    setDealerEvaluation(dealerEval);
    
    // 使用新的比较函数
    const comparison = compareHands(finalPlayerHand, finalDealerHand);
    console.log('Final comparison result:', comparison);
    
    let result = '';
    
    if (comparison > 0) {
      result = 'playerWins';
      setStats(prev => ({
        ...prev,
        totalGames: prev.totalGames + 1,
        playerWins: prev.playerWins + 1
      }));
    } else if (comparison < 0) {
      result = 'dealerWins';
      setStats(prev => ({
        ...prev,
        totalGames: prev.totalGames + 1,
        dealerWins: prev.dealerWins + 1
      }));
    } else {
      result = 'tie';
      setStats(prev => ({
        ...prev,
        totalGames: prev.totalGames + 1,
        ties: prev.ties + 1
      }));
    }
    
    setGameResult(result);
    setGamePhase('game-over');
  };

  // 初始化游戏
  useEffect(() => {
    startNewGame();
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen p-2 sm:p-4 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-green-50 to-blue-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isDarkMode ? <Sun size={14} className="sm:w-4 sm:h-4" /> : <Moon size={14} className="sm:w-4 sm:h-4" />}
              {isDarkMode ? (language === 'zh' ? '明亮' : 'Light') : (language === 'zh' ? '深色' : 'Dark')}
            </button>
            
            <h1 className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getTranslation('title', language)}
            </h1>
            
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Globe size={14} className="sm:w-4 sm:h-4" />
              {language === 'zh' ? '中文' : 'English'}
            </button>
          </div>
          
          {/* 重置游戏按钮 */}
          <div className="mb-2 sm:mb-4">
            <button
              onClick={resetGame}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm font-medium mx-auto ${
                isDarkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <RefreshCw size={14} className="sm:w-4 sm:h-4" />
              {language === 'zh' ? '重置游戏' : 'Reset Game'}
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <GameStatsComponent stats={stats} language={language} isDarkMode={isDarkMode} />

        {/* 游戏区域 */}
        <div className={`rounded-xl shadow-xl p-3 sm:p-6 mb-4 sm:mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* 庄家手牌 */}
          <Hand
            cards={dealerHand}
            title={getTranslation('dealerCards', language)}
            isHidden={gamePhase !== 'game-over'}
            language={language}
            handEvaluation={dealerEvaluation}
            showEvaluation={gamePhase === 'game-over'}
            isDarkMode={isDarkMode}
          />

          {/* 游戏状态显示 */}
          <div className="text-center py-2 sm:py-4">
            {gamePhase === 'player-replace' && (
              <div className="space-y-2">
                <div className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {selectedCards.length > 0 
                    ? getTranslation('replaceHint', language)
                    : getTranslation('continueHint', language)
                  }
                </div>
                {selectedCards.length > 0 && (
                  <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getTranslation('selectedCards', language)}: {selectedCards.length}/3
                  </div>
                )}
              </div>
            )}
            {gamePhase === 'dealer-replace' && (
              <div className={`font-medium text-sm sm:text-base flex items-center justify-center gap-2 ${
                isDarkMode ? 'text-orange-400' : 'text-orange-600'
              }`}>
                <RotateCcw className="animate-spin" size={14} />
                {getTranslation('dealerReplacing', language)}
              </div>
            )}
            {gamePhase === 'revealing' && (
              <div className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {getTranslation('comparing', language)}
              </div>
            )}
            {gamePhase === 'game-over' && (
              <div className="space-y-2">
                <div className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {getTranslation('result', language)}: <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>{getTranslation(gameResult, language)}</span>
                </div>
                <div className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {getTranslation('dealerReplaced', language)}: {dealerReplacedCount} {getTranslation('cards', language)}
                </div>
              </div>
            )}
          </div>

          {/* 玩家手牌 */}
          <Hand
            cards={playerHand}
            title={getTranslation('yourCards', language)}
            selectedCards={selectedCards}
            onCardClick={gamePhase === 'player-replace' ? handleCardClick : undefined}
            language={language}
            handEvaluation={playerEvaluation}
            showEvaluation={gamePhase === 'game-over'}
            isDarkMode={isDarkMode}
          />

          {/* 操作按钮 */}
          <div className="text-center">
            {gamePhase === 'player-replace' && (
              <button
                onClick={replacePlayerCards}
                className={`font-bold py-2 px-4 sm:py-3 sm:px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2 mx-auto text-sm sm:text-base ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <RotateCcw size={16} className="sm:w-5 sm:h-5" />
                {selectedCards.length === 0 
                  ? getTranslation('continue', language)
                  : `${getTranslation('replaceCards', language)} (${selectedCards.length})`
                }
              </button>
            )}
            {gamePhase === 'game-over' && (
              <button
                onClick={startNewGame}
                className={`font-bold py-2 px-4 sm:py-3 sm:px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2 mx-auto text-sm sm:text-base ${
                  isDarkMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Play size={16} className="sm:w-5 sm:h-5" />
                {language === 'zh' ? '再玩一局' : 'Play Again'}
              </button>
            )}
          </div>
        </div>

        {/* 游戏说明 */}
        <div className={`rounded-lg p-4 sm:p-6 mb-4 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-base sm:text-lg font-bold mb-3 text-center ${
            isDarkMode ? 'text-yellow-400' : 'text-orange-600'
          }`}>
            📋 {getTranslation('gameRules', language)}
          </h3>
          <div className={`text-xs sm:text-sm space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="text-center font-medium">
              {language === 'zh' 
                ? '🎯 操作说明：点击牌面选择要换的牌（最多3张），然后点击换牌按钮开始对战' 
                : '🎯 How to play: Click cards to select for replacement (max 3), then click replace button to start'
              }
            </p>
            <p className="text-center">
              {language === 'zh' 
                ? '🏆 牌型从大到小：同花顺 > 四条 > 葫芦 > 同花 > 顺子 > 三条 > 两对 > 一对 > 散牌' 
                : '🏆 Hand rankings: Straight Flush > Four of a Kind > Full House > Flush > Straight > Three of a Kind > Two Pairs > One Pair > High Card'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};