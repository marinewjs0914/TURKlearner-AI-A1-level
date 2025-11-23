import React, { useState, useEffect } from 'react';
import { VocabWord } from '../types';
import { playTurkishTTS } from '../services/geminiService';

interface FlashcardProps {
  word: VocabWord;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentIndex: number;
  total: number;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  word, 
  onNext, 
  onPrev, 
  isFirst, 
  isLast,
  currentIndex,
  total
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset state and Auto-play when word changes
  useEffect(() => {
    setIsFlipped(false);
    
    // Auto-play audio with a small delay for better UX
    const timer = setTimeout(() => {
      // Auto-play shouldn't alert on error
      playTurkishTTS(word.turkish).catch(e => console.warn("Auto-play TTS failed:", e));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [word]);

  const playAudio = async (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); 
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      await playTurkishTTS(text);
    } catch (err) {
      console.error("Manual TTS playback failed:", err);
      // For manual clicks, we want to inform the user if it fails
      alert("播放失敗，請檢查網路連線或稍後再試。");
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full perspective-1000">
      <div className="mb-4 flex justify-between text-sm text-gray-500 font-medium">
        <span>單字卡</span>
        <span>{currentIndex + 1} / {total}</span>
      </div>

      <div 
        className="relative w-full h-[480px] cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`card-flip w-full h-full relative ${isFlipped ? 'flipped' : ''}`}>
          
          {/* Front Side */}
          <div className="card-front absolute w-full h-full bg-white rounded-3xl shadow-lg border border-sand-200 flex flex-col items-center justify-center p-6 text-center">
             <div className="absolute top-4 right-4 bg-sand-100 px-3 py-1 rounded-full text-xs text-sand-600 font-bold uppercase tracking-wider">
               Turkish
             </div>
             
             <h3 className="text-4xl font-bold text-turquoise-800 mb-2">{word.turkish}</h3>
             
             <p className="text-gray-400 italic mb-12">/{word.pronunciation}/</p>
             
             <div className="flex items-center justify-center space-x-10 mb-8">
                {/* Play TTS Button */}
               <div className="flex flex-col items-center gap-2">
                 <button
                   onClick={(e) => playAudio(word.turkish, e)}
                   className={`p-6 rounded-full bg-turquoise-100 text-turquoise-600 hover:bg-turquoise-200 transition-all transform hover:scale-105 shadow-sm ${isPlaying ? 'animate-pulse ring-2 ring-turquoise-400' : ''}`}
                   aria-label="Play Audio"
                   title="播放發音"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                   </svg>
                 </button>
                 <span className="text-sm text-turquoise-600 font-bold tracking-wide">播放單字</span>
               </div>
             </div>
             
             <p className="absolute bottom-4 text-gray-300 text-xs">
               點擊卡片翻面查看解釋
             </p>
          </div>

          {/* Back Side */}
          <div className="card-back absolute w-full h-full bg-turquoise-700 text-white rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
            <div className="absolute top-4 right-4 bg-turquoise-800 px-3 py-1 rounded-full text-xs text-turquoise-200 font-bold uppercase tracking-wider">
               Meaning
             </div>
            
            <h3 className="text-3xl font-bold mb-6">{word.chinese}</h3>
            
            <div className="w-full bg-turquoise-800/50 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-3">
                  <p className="text-lg text-turquoise-100 font-medium">"{word.exampleSentence}"</p>
                  <button
                    onClick={(e) => playAudio(word.exampleSentence, e)}
                    className="p-2.5 rounded-full bg-turquoise-500/80 hover:bg-turquoise-400 text-white transition-all transform hover:scale-110 flex-shrink-0 shadow-md"
                    title="播放例句發音"
                    aria-label="Play Example Sentence"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-turquoise-200 mt-1">{word.exampleTranslation}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors ${
            isFirst 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
          }`}
        >
          <span>←</span> <span>上一個</span>
        </button>

        <button
          onClick={onNext}
          className="px-6 py-3 rounded-xl font-bold bg-turquoise-600 text-white shadow-md hover:bg-turquoise-700 transition-colors flex items-center space-x-2"
        >
          <span>{isLast ? '開始測驗' : '下一個'}</span> <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default Flashcard;