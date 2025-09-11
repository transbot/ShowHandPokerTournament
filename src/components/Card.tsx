import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isHidden?: boolean;
  onClick?: () => void;
  className?: string;
  isDarkMode?: boolean;
}

// 获取人头牌的图案
const getFaceCardPattern = (rank: string, suit: string): JSX.Element | null => {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const color = isRed ? '#dc2626' : '#1f2937';
  
  if (rank === 'J') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Jack 图案 - 简化的骑士头像 */}
        <svg width="32" height="40" viewBox="0 0 32 40" className="absolute">
          {/* 头部轮廓 */}
          <ellipse cx="16" cy="15" rx="8" ry="10" fill={color} opacity="0.8"/>
          {/* 帽子 */}
          <path d="M8 10 Q16 5 24 10 L24 8 Q16 3 8 8 Z" fill={color}/>
          {/* 羽毛装饰 */}
          <path d="M20 8 Q22 6 24 8 Q22 10 20 8" fill={color} opacity="0.6"/>
          {/* 面部特征 */}
          <circle cx="13" cy="13" r="1" fill="white"/>
          <circle cx="19" cy="13" r="1" fill="white"/>
          <path d="M14 18 Q16 20 18 18" stroke="white" strokeWidth="1" fill="none"/>
          {/* 身体轮廓 */}
          <rect x="12" y="25" width="8" height="12" rx="2" fill={color} opacity="0.7"/>
          {/* 装饰线条 */}
          <line x1="10" y1="30" x2="22" y2="30" stroke={color} strokeWidth="1"/>
        </svg>
      </div>
    );
  }
  
  if (rank === 'Q') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Queen 图案 - 简化的女王头像 */}
        <svg width="32" height="40" viewBox="0 0 32 40" className="absolute">
          {/* 头部轮廓 */}
          <ellipse cx="16" cy="15" rx="7" ry="9" fill={color} opacity="0.8"/>
          {/* 皇冠 */}
          <path d="M9 8 L12 5 L16 7 L20 5 L23 8 L23 10 L9 10 Z" fill={color}/>
          {/* 皇冠装饰 */}
          <circle cx="12" cy="6" r="1" fill={color}/>
          <circle cx="16" cy="5" r="1" fill={color}/>
          <circle cx="20" cy="6" r="1" fill={color}/>
          {/* 面部特征 */}
          <circle cx="13" cy="13" r="1" fill="white"/>
          <circle cx="19" cy="13" r="1" fill="white"/>
          <path d="M14 17 Q16 19 18 17" stroke="white" strokeWidth="1" fill="none"/>
          {/* 头发 */}
          <path d="M10 12 Q8 15 10 18 Q12 16 14 18" stroke={color} strokeWidth="1" fill="none"/>
          <path d="M22 12 Q24 15 22 18 Q20 16 18 18" stroke={color} strokeWidth="1" fill="none"/>
          {/* 身体轮廓 */}
          <path d="M12 24 Q16 26 20 24 L20 36 Q16 38 12 36 Z" fill={color} opacity="0.7"/>
          {/* 装饰 */}
          <circle cx="16" cy="30" r="2" fill="white" opacity="0.5"/>
        </svg>
      </div>
    );
  }
  
  if (rank === 'K') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* King 图案 - 简化的国王头像 */}
        <svg width="32" height="40" viewBox="0 0 32 40" className="absolute">
          {/* 头部轮廓 */}
          <ellipse cx="16" cy="16" rx="8" ry="10" fill={color} opacity="0.8"/>
          {/* 皇冠 */}
          <path d="M8 8 L10 4 L14 6 L16 3 L18 6 L22 4 L24 8 L24 11 L8 11 Z" fill={color}/>
          {/* 皇冠宝石 */}
          <circle cx="12" cy="7" r="1.5" fill="white" opacity="0.8"/>
          <circle cx="16" cy="5" r="1.5" fill="white" opacity="0.8"/>
          <circle cx="20" cy="7" r="1.5" fill="white" opacity="0.8"/>
          {/* 面部特征 */}
          <circle cx="13" cy="14" r="1" fill="white"/>
          <circle cx="19" cy="14" r="1" fill="white"/>
          <path d="M14 18 Q16 20 18 18" stroke="white" strokeWidth="1" fill="none"/>
          {/* 胡须 */}
          <path d="M12 20 Q16 22 20 20" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M13 22 Q16 24 19 22" stroke="white" strokeWidth="1" fill="none"/>
          {/* 身体轮廓 */}
          <rect x="11" y="26" width="10" height="12" rx="2" fill={color} opacity="0.7"/>
          {/* 权杖 */}
          <line x1="6" y1="25" x2="6" y2="35" stroke={color} strokeWidth="2"/>
          <circle cx="6" cy="23" r="2" fill={color}/>
          {/* 装饰线条 */}
          <line x1="11" y1="32" x2="21" y2="32" stroke="white" strokeWidth="1"/>
        </svg>
      </div>
    );
  }
  
  return null;
};

export const Card: React.FC<CardProps> = ({ 
  card, 
  isSelected = false, 
  isHidden = false, 
  onClick,
  className = '',
  isDarkMode = false
}) => {
  const getSuitSymbol = (suit: string): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit: string): string => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black';
  };

  const isFaceCard = card.rank === 'J' || card.rank === 'Q' || card.rank === 'K';
  
  if (isHidden) {
    return (
      <div className={`w-12 h-18 sm:w-20 sm:h-32 border-2 rounded-lg flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gray-600 border-gray-500' 
          : 'bg-blue-600 border-blue-700'
      } ${className}`}>
        <div className={`w-6 h-9 sm:w-10 sm:h-16 rounded border opacity-60 ${
          isDarkMode 
            ? 'bg-gray-500 border-gray-400' 
            : 'bg-blue-500 border-blue-400'
        }`}></div>
      </div>
    );
  }

  return (
    <div
      className={`
        w-12 h-18 sm:w-20 sm:h-32 border-2 rounded-lg flex flex-col justify-between p-1 sm:p-2 cursor-pointer relative
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        ${isDarkMode ? 'bg-gray-100' : 'bg-white'}
        ${isSelected 
          ? (isDarkMode 
              ? 'border-blue-400 bg-blue-100 ring-2 ring-blue-300' 
              : 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
            )
          : (isDarkMode 
              ? 'border-gray-400' 
              : 'border-gray-300'
            )
        }
        ${onClick ? 'hover:border-blue-400' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className={`text-xs sm:text-sm font-bold ${getSuitColor(card.suit)} leading-none`}>
        <div>{card.rank}</div>
        <div>{getSuitSymbol(card.suit)}</div>
      </div>
      
      {isFaceCard ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="scale-75 sm:scale-125">
            {getFaceCardPattern(card.rank, card.suit)}
          </div>
        </div>
      ) : (
        <div className={`text-lg sm:text-3xl ${getSuitColor(card.suit)} text-center`}>
          {getSuitSymbol(card.suit)}
        </div>
      )}
      
      <div className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-xs sm:text-sm font-bold ${getSuitColor(card.suit)} leading-none transform rotate-180 z-10`}>
        <div>{card.rank}</div>
        <div>{getSuitSymbol(card.suit)}</div>
      </div>
    </div>
  );
};