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
      <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h3>
      
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
        {/* 头像 */}
        <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg ${
          isDealer 
            ? (isDarkMode ? 'bg-red-600' : 'bg-red-500')
            : (isDarkMode ? 'bg-blue-600' : 'bg-blue-500')
        }`}>
          {isDealer ? (
            <Bot size={24} className="sm:w-8 sm:h-8 text-white" />
          ) : (
            <User size={24} className="sm:w-8 sm:h-8 text-white" />
          )}
        </div>
        
        {/* 手牌 */}
        <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
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
              ? 'bg-gray-700 text-gray-300' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {getTranslation(`handTypes.${handEvaluation.type}`, language)}
          </span>
        </div>
      )}
    </div>
  );
};