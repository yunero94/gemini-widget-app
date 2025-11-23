import React from 'react';
import { QuoteData, AppState, FontStyle } from '../types';
import { Loader2, Quote } from 'lucide-react';

interface QuoteCardProps {
  data: QuoteData | null;
  state: AppState;
  fontStyle: FontStyle;
  textSize: number;
  textColor: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ data, state, fontStyle, textSize, textColor }) => {
  if (state === AppState.LOADING || !data) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center min-h-[200px] animate-pulse">
        <Loader2 className="w-10 h-10 text-white/70 animate-spin" />
      </div>
    );
  }

  const fontClass = fontStyle === 'serif' ? 'font-serif italic' : 'font-sans font-bold tracking-tight';

  return (
    <div className="w-full max-w-sm mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 ease-out transform hover:scale-[1.02]">
      <div className="p-8 flex flex-col items-center text-center">
        <Quote 
          className="w-8 h-8 mb-6 rotate-180" 
          style={{ color: textColor, opacity: 0.6 }}
        />
        
        <p 
            className={`leading-relaxed drop-shadow-md mb-6 ${fontClass}`}
            style={{ 
              fontSize: `${1.25 * textSize}rem`, 
              lineHeight: `${1.6 * textSize}rem`,
              color: textColor
            }}
        >
          "{data.text}"
        </p>
        
        <div 
          className="w-12 h-0.5 rounded-full mb-4"
          style={{ backgroundColor: textColor, opacity: 0.4 }}
        ></div>
        
        <p 
            className="font-medium tracking-wider uppercase drop-shadow-sm"
            style={{ 
              fontSize: `${0.875 * textSize}rem`,
              color: textColor,
              opacity: 0.9
            }}
        >
          {data.reference}
        </p>
      </div>
      
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
    </div>
  );
};