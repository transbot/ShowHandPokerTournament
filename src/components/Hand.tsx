import React from 'react';
import { Card as CardType, Language, HandEvaluation } from '../types';
import { Card } from './Card';
import { getTranslation } from '../translations';

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
  return (
    <div className="mb-4 sm:mb-6">
      <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h3>
      <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3 justify-center flex-wrap">
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
            isDealing={animationState.isDealing && animationState.dealingIndex % 2 === 0}
          />
        ))}
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