import React from 'react';
import { Card as CardType, Language, HandEvaluation } from '../types';
import { Card } from './Card';
import { getTranslation } from '../translations';
import { Bot, User } from 'lucide-react';

interface HandProps {
  cards: CardType[];
  title: string;
  isHidden?: boolean;
  selectedCards?: number[];
  onCardClick?: (index: number) => void;
  language: Language;
  handEvaluation?: HandEvaluation;
  showEvaluation?: boolean;
  isDarkMode?: boolean;
  animatingCards?: number[];
  isDealing?: boolean;
}

export const Hand: React.FC<HandProps> = ({
  cards,
  title,
  isHidden = false,
  selectedCards = [],
  onCardClick,
  language,
  handEvaluation,
  showEvaluation = false,
  isDarkMode = false,
  animatingCards = [],
  isDealing = false
}) => {
  const isDealer = title.includes('庄家') || title.includes('Dealer');
  
  return (
    <div className="mb-4 sm:mb-6">
      <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400' : 'text-gray-800'}`}>{title}</h3>
      
      <div className="relative mb-2 sm:mb-3">
        {/* 固定头像 - 绝对定位在左侧 */}
        <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg z-10 ${
          isDealer 
            ? (isDarkMode ? 'bg-gradient-to-r from-red-600 to-pink-600 shadow-lg shadow-red-500/25' : 'bg-red-500')
            : (isDarkMode ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25' : 'bg-blue-500')
        }`}>
          {isDealer ? (
            <Bot size={20} className="sm:w-8 sm:h-8 text-white" />
          ) : (
            <User size={20} className="sm:w-8 sm:h-8 text-white" />
          )}
        </div>
        
        {/* 手牌区域 - 左侧留出头像空间 */}
        <div className="flex gap-1 sm:gap-2 flex-wrap justify-center ml-14 sm:ml-24">
          {cards.map((card, index) => (
            <Card
              key={`${card.id}-${index}`}
              card={card}
              isHidden={isHidden}
              isSelected={selectedCards.includes(index)}
              onClick={() => onCardClick?.(index)}
              isDarkMode={isDarkMode}
              className={`
                ${isDealing ? 'animate-bounce' : ''}
                ${animatingCards.includes(index) ? 'animate-pulse scale-110' : ''}
                transition-all duration-300
              `}
            />
          ))}
        </div>
      </div>
      
      {showEvaluation && handEvaluation && (
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white backdrop-blur-sm border border-purple-500/20' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {getTranslation(`handTypes.${handEvaluation.type}`, language)}
          </span>
        </div>
      )}
    </div>
  );
};