import React from 'react';
import { GameStats as GameStatsType, Language } from '../types';
import { getTranslation } from '../translations';

interface GameStatsProps {
  stats: GameStatsType;
  language: Language;
  isDarkMode?: boolean;
}

export const GameStats: React.FC<GameStatsProps> = ({ stats, language, isDarkMode = false }) => {
  const winRate = stats.totalGames > 0 
    ? ((stats.playerWins / stats.totalGames) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className={`rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 ${
      isDarkMode ? 'bg-gray-900/80 backdrop-blur-sm border border-purple-500/20' : 'bg-gray-50'
    }`}>
      <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${
        isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400' : 'text-gray-800'
      }`}>
        {getTranslation('stats', language)}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
        <div>
          <div className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400' : 'text-blue-600'}`}>{stats.totalGames}</div>
          <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getTranslation('totalGames', language)}</div>
        </div>
        <div>
          <div className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400' : 'text-green-600'}`}>{stats.playerWins}</div>
          <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getTranslation('wins', language)}</div>
        </div>
        <div>
          <div className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400' : 'text-red-600'}`}>{stats.dealerWins}</div>
          <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getTranslation('losses', language)}</div>
        </div>
        <div>
          <div className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : 'text-purple-600'}`}>{winRate}%</div>
          <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getTranslation('winRate', language)}</div>
        </div>
      </div>
    </div>
  );
};