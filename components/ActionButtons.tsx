import React, { useState } from 'react';
import { QuoteCategory, FontStyle } from '../types';
import { CATEGORY_LABELS } from '../constants';
import { RefreshCcw, Book, Heart, Settings2, Trophy, Columns, Eye, Type, Share2, Check, Palette } from 'lucide-react';

interface ActionButtonsProps {
  currentCategory: QuoteCategory;
  onCategoryChange: (category: QuoteCategory) => void;
  onRefresh: () => void;
  isLoading: boolean;
  fontStyle: FontStyle;
  onFontChange: (style: FontStyle) => void;
  textSize: number;
  onTextSizeChange: (size: number) => void;
  onEnterLockMode: () => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
  onShare: () => void;
}

const PRESET_COLORS = [
  '#FFFFFF', // White
  '#E2E8F0', // Slate 200
  '#94A3B8', // Slate 400
  '#FECACA', // Red 200
  '#F87171', // Red 400
  '#FDBA74', // Orange 300
  '#FB923C', // Orange 400
  '#FEF3C7', // Amber 100
  '#FCD34D', // Amber 300
  '#FACC15', // Yellow 400
  '#BEF264', // Lime 400
  '#86EFAC', // Green 300
  '#4ADE80', // Green 400
  '#34D399', // Emerald 400
  '#5EEAD4', // Teal 300
  '#67E8F9', // Cyan 300
  '#93C5FD', // Blue 300
  '#818CF8', // Indigo 400
  '#C084FC', // Purple 400
  '#F472B6', // Pink 400
];

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  currentCategory, 
  onCategoryChange, 
  onRefresh, 
  isLoading,
  fontStyle,
  onFontChange,
  textSize,
  onTextSizeChange,
  onEnterLockMode,
  textColor,
  onTextColorChange,
  onShare
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [justShared, setJustShared] = useState(false);

  const handleShareClick = () => {
    onShare();
    setJustShared(true);
    setTimeout(() => setJustShared(false), 2000);
  };

  const getIcon = (cat: QuoteCategory) => {
    switch(cat) {
      case QuoteCategory.BIBLE: return <Book size={16} />;
      case QuoteCategory.STOIC: return <Columns size={16} />;
      case QuoteCategory.PRAYER: return <Heart size={16} />;
      case QuoteCategory.ATHLETE: return <Trophy size={16} />;
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-sm mx-auto pointer-events-auto">
      
      {/* 1. Category Selector */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-1.5 flex justify-between shadow-lg">
        {(Object.keys(CATEGORY_LABELS) as QuoteCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
              currentCategory === cat 
                ? 'bg-white text-black shadow-md' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            {getIcon(cat)}
            <span className="hidden sm:inline">{CATEGORY_LABELS[cat]}</span>
          </button>
        ))}
      </div>

      {/* 2. Main Actions Bar */}
      <div className="grid grid-cols-4 gap-3">
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex flex-col items-center justify-center gap-1 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span className="text-[10px] font-semibold tracking-wide opacity-70">REFRESH</span>
        </button>

        <button 
          onClick={onEnterLockMode}
          className="flex flex-col items-center justify-center gap-1 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 active:scale-95 transition-all shadow-lg"
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wide opacity-70">PREVIEW</span>
        </button>

        <button 
          onClick={handleShareClick}
          className="flex flex-col items-center justify-center gap-1 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 active:scale-95 transition-all shadow-lg"
        >
          {justShared ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
          <span className="text-[10px] font-semibold tracking-wide opacity-70">SHARE</span>
        </button>

        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`flex flex-col items-center justify-center gap-1 h-16 rounded-2xl backdrop-blur-md border transition-all shadow-lg ${
            showSettings 
            ? 'bg-white text-black border-white' 
            : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Settings2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wide opacity-70">STYLE</span>
        </button>
      </div>

      {/* 3. Settings Panel (Collapsible) */}
      <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${showSettings ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-6 bg-black/60 p-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-xl mt-2">
            
            {/* Font & Size Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/50 mb-1">
                    <Type size={14} />
                    <span className="text-xs uppercase tracking-widest font-bold">Typography</span>
                </div>
                
                <div className="flex flex-col gap-4">
                    {/* Font Style Toggles */}
                    <div className="flex bg-white/5 rounded-xl p-1 gap-1 w-full">
                      <button
                        onClick={() => onFontChange('serif')}
                        className={`flex-1 py-2 rounded-lg text-xs font-serif italic transition-all ${
                          fontStyle === 'serif' ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Classic
                      </button>
                      <button
                        onClick={() => onFontChange('sans')}
                        className={`flex-1 py-2 rounded-lg text-xs font-sans font-bold transition-all ${
                          fontStyle === 'sans' ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Modern
                      </button>
                    </div>

                    {/* Text Size Slider */}
                    <div className="flex items-center gap-3 px-1">
                        <span className="text-[10px] text-white/40 font-bold w-8">SIZE</span>
                        <input 
                          type="range" 
                          min="0.8" 
                          max="1.6" 
                          step="0.1"
                          value={textSize}
                          onChange={(e) => onTextSizeChange(parseFloat(e.target.value))}
                          className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/5"></div>

            {/* Color Palette Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/50 mb-1">
                    <Palette size={14} />
                    <span className="text-xs uppercase tracking-widest font-bold">Color</span>
                </div>
                
                {/* Mobile-friendly horizontal scroll container */}
                <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-4 snap-x mask-linear">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => onTextColorChange(color)}
                      className={`flex-shrink-0 w-10 h-10 rounded-full border shadow-sm transition-all duration-200 snap-center ${
                        textColor === color 
                          ? 'border-white scale-110 ring-2 ring-white/20' 
                          : 'border-white/10 hover:border-white/50 opacity-90'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};