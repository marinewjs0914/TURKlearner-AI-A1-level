import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface CategoryGridProps {
  onSelect: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-turquoise-900">你好! Merhaba!</h2>
        <p className="text-gray-600">請選擇一個主題開始學習土耳其語單字。</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-turquoise-400 text-left flex flex-col items-center gap-3"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300 block">
              {cat.emoji}
            </span>
            <span className="font-bold text-gray-800 text-lg text-center">
              {cat.label}
            </span>
            <div className="absolute inset-0 bg-turquoise-50 opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;