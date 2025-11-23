import React, { useState, useEffect } from 'react';
import { VocabWord } from '../types';
import { playTurkishTTS } from '../services/geminiService';

interface QuizProps {
  words: VocabWord[];
  onRestart: () => void;
  onHome: () => void;
}

const Quiz: React.FC<QuizProps> = ({ words, onRestart, onHome }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerProcessed, setIsAnswerProcessed] = useState(false);
  
  // Create options for current question
  const currentWord = words[currentQuestionIndex];
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    // Generate 3 distractors + 1 correct answer
    const distractors = words
      .filter(w => w.turkish !== currentWord.turkish)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.chinese);
    
    const allOptions = [...distractors, currentWord.chinese].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setIsAnswerProcessed(false);
    setSelectedAnswer(null);
    
    // Auto play audio for the question
    playTurkishTTS(currentWord.turkish).catch(() => {});
  }, [currentWord, words, currentQuestionIndex]);

  const handleAnswer = (answer: string) => {
    if (isAnswerProcessed) return;
    
    setSelectedAnswer(answer);
    setIsAnswerProcessed(true);

    const isCorrect = answer === currentWord.chinese;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    // Delay before next question
    setTimeout(() => {
      if (currentQuestionIndex < words.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const playAgain = () => {
    playTurkishTTS(currentWord.turkish);
  };

  if (showResult) {
    const percentage = Math.round((score / words.length) * 100);
    return (
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl shadow-lg border border-sand-200">
        <div className="mb-6 text-6xl">🎉</div>
        <h2 className="text-3xl font-bold text-turquoise-900 mb-2">測驗完成!</h2>
        <p className="text-gray-600 mb-6">Harika! (太棒了!)</p>
        
        <div className="mb-8">
          <div className="text-5xl font-bold text-turquoise-600 mb-2">{score} / {words.length}</div>
          <p className="text-sm text-gray-500">正確率: {percentage}%</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onRestart}
            className="w-full py-3 bg-turquoise-600 text-white rounded-xl font-bold hover:bg-turquoise-700 transition-colors"
          >
            再次練習這個單元
          </button>
          <button 
            onClick={onHome}
            className="w-full py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            選擇新主題
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Quiz Mode</span>
        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-turquoise-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-sand-200 mb-6 text-center">
         <p className="text-gray-500 text-sm mb-4">這個單字是什麼意思?</p>
         <h2 className="text-4xl font-bold text-turquoise-800 mb-4">{currentWord.turkish}</h2>
         <button 
           onClick={playAgain}
           className="inline-flex items-center space-x-2 text-turquoise-600 hover:text-turquoise-800 text-sm font-medium bg-turquoise-50 px-3 py-1 rounded-full"
         >
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
           <span>重聽發音</span>
         </button>
      </div>

      <div className="grid gap-3">
        {options.map((option, idx) => {
          let btnClass = "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"; // Default
          
          if (isAnswerProcessed) {
            if (option === currentWord.chinese) {
              btnClass = "bg-green-100 border-green-400 text-green-800"; // Correct
            } else if (option === selectedAnswer) {
              btnClass = "bg-red-100 border-red-400 text-red-800"; // Wrong selected
            } else {
              btnClass = "bg-gray-50 text-gray-400 border-gray-100 opacity-50"; // Others
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={isAnswerProcessed}
              className={`w-full p-4 rounded-xl border-2 text-lg font-medium transition-all duration-200 ${btnClass} ${!isAnswerProcessed && 'hover:border-turquoise-300'}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;