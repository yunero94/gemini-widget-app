import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ClockWidget } from './components/ClockWidget';
import { QuoteCard } from './components/QuoteCard';
import { ActionButtons } from './components/ActionButtons';
import { QuoteCategory, QuoteData, AppState, FontStyle } from './types';
import { INITIAL_CATEGORY, CATEGORY_ORDER } from './constants';
import { fetchQuote } from './services/geminiService';
import { EyeOff } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [category, setCategory] = useState<QuoteCategory>(INITIAL_CATEGORY);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [fontStyle, setFontStyle] = useState<FontStyle>('sans');
  
  // Customization State
  const [textSize, setTextSize] = useState<number>(1); 
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [isLockMode, setIsLockMode] = useState<boolean>(false);

  // Background Management
  const [currentBgUrl, setCurrentBgUrl] = useState<string>("");
  const [nextBgUrl, setNextBgUrl] = useState<string>("");
  const [isBgLoading, setIsBgLoading] = useState<boolean>(true);

  // Gesture State
  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  // --- Logic ---

  // Preload Image to prevent flickering
  const loadNewBackground = useCallback(() => {
    const seed = Date.now();
    // Use a high quality but reasonably sized image request
    const prompt = "abstract nature, landscape, atmospheric, cinematic lighting, 8k, minimalistic";
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=720&height=1280&nologo=true&seed=${seed}&model=flux`;
    
    // Set loading only if we don't have a background yet (first load)
    if (!currentBgUrl) setIsBgLoading(true);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setNextBgUrl(url);
      // Small delay to ensure CSS transition looks smooth
      setTimeout(() => {
        setCurrentBgUrl(url);
        setIsBgLoading(false);
      }, 50);
    };
  }, [currentBgUrl]);

  // Load Quote and Background
  const loadQuote = useCallback(async (targetCategory: QuoteCategory) => {
    setAppState(AppState.LOADING);
    
    // Trigger background load
    loadNewBackground();

    try {
      const data = await fetchQuote(targetCategory);
      setQuoteData(data);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  }, [loadNewBackground]);

  // Initial load
  useEffect(() => {
    loadQuote(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Share Functionality
  const handleShare = async () => {
    if (!quoteData) return;
    const shareText = `"${quoteData.text}"\n— ${quoteData.reference}\n\nVia Prayer & Promise`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Prayer & Promise',
          text: shareText,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Quote copied to clipboard!");
    }
  };

  // --- Gestures ---

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStart.current.x - touchEndX;
    const diffY = touchStart.current.y - touchEndY;

    // Reset
    touchStart.current = null;

    // Thresholds
    const SWIPE_THRESHOLD = 50;

    // Horizontal Swipe (Change Category)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD) {
      const currentIndex = CATEGORY_ORDER.indexOf(category);
      if (diffX > 0) {
        // Swipe Left -> Next Category
        const nextIndex = (currentIndex + 1) % CATEGORY_ORDER.length;
        const nextCat = CATEGORY_ORDER[nextIndex];
        setCategory(nextCat);
        loadQuote(nextCat);
      } else {
        // Swipe Right -> Prev Category
        const prevIndex = (currentIndex - 1 + CATEGORY_ORDER.length) % CATEGORY_ORDER.length;
        const prevCat = CATEGORY_ORDER[prevIndex];
        setCategory(prevCat);
        loadQuote(prevCat);
      }
      return;
    }

    // Vertical Swipe (Refresh) - Only if at top of scroll
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > SWIPE_THRESHOLD) {
      if (diffY < 0 && scrollContainerRef.current?.scrollTop === 0) {
        // Swipe Down -> Refresh
        loadQuote(category);
      }
    }
  };

  // Double tap to exit lock mode
  const handleInteraction = () => {
    if (!isLockMode) return;
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      setIsLockMode(false);
    }
    lastTapRef.current = now;
  };

  return (
    <main 
        className={`relative w-full h-[100dvh] overflow-hidden text-white selection:bg-white/30 ${fontStyle === 'serif' ? 'font-serif' : 'font-sans'}`}
        onClick={handleInteraction}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >
      
      {/* Background Layers for Smooth Transition */}
      <div 
        className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out`}
        style={{ 
          backgroundImage: `url(${currentBgUrl})`,
          filter: `brightness(0.6)`,
          opacity: isBgLoading ? 0 : 1
        }}
      />
      
      {/* Static gradient overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80 pointer-events-none" />

      {/* Helper Toast for Lock Mode */}
      {isLockMode && (
        <div className="absolute top-12 left-0 right-0 z-50 flex justify-center pointer-events-none animate-fade-out opacity-0" style={{ animation: 'fadeOut 3s forwards' }}>
             <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs text-white/80">
                <EyeOff size={14} />
                <span>Double tap to unlock</span>
             </div>
        </div>
      )}

      {/* Scrollable Content Container */}
      <div 
        ref={scrollContainerRef}
        className={`relative z-10 w-full h-full ${isLockMode ? 'overflow-hidden' : 'overflow-y-auto scrollbar-hide'}`}
      >
          <div className="min-h-full flex flex-col max-w-md mx-auto px-6 py-8 md:py-12 gap-6">
            
            {/* Top Section: Clock */}
            <div className={`flex-shrink-0 transition-all duration-500 origin-top flex justify-center ${isLockMode ? 'scale-110 mt-10' : ''}`}>
              <ClockWidget textColor={textColor} />
            </div>

            {/* Middle Section: Widget Card */}
            <div className="flex-grow flex flex-col justify-center items-center w-full my-4">
              <QuoteCard 
                data={quoteData} 
                state={appState} 
                fontStyle={fontStyle} 
                textSize={textSize}
                textColor={textColor}
              />
            </div>

            {/* Bottom Section: Controls */}
            <div className={`flex-shrink-0 transition-all duration-500 transform ${isLockMode ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
              <ActionButtons 
                currentCategory={category}
                onCategoryChange={(cat) => { setCategory(cat); loadQuote(cat); }}
                onRefresh={() => loadQuote(category)}
                isLoading={appState === AppState.LOADING}
                fontStyle={fontStyle}
                onFontChange={setFontStyle}
                textSize={textSize}
                onTextSizeChange={setTextSize}
                onEnterLockMode={() => setIsLockMode(true)}
                textColor={textColor}
                onTextColorChange={setTextColor}
                onShare={handleShare}
              />
              
              <div className="mt-8 mb-4 text-center opacity-40 text-[10px] font-bold tracking-[0.2em] uppercase">
                Prayer & Promise
              </div>
            </div>

          </div>
      </div>

      <style>{`
        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

    </main>
  );
};

export default App;