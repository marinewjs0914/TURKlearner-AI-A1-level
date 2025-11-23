import React, { useState } from 'react';
import Layout from './components/Layout';
import CategoryGrid from './components/CategoryGrid';
import LoadingSpinner from './components/LoadingSpinner';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import { AppState, Category, VocabWord } from './types';
import { generateVocabulary } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSelectCategory = async (category: Category) => {
    setCurrentCategory(category);
    setAppState(AppState.LOADING);
    setErrorMsg("");

    try {
      const generatedWords = await generateVocabulary(category.promptTopic);
      setWords(generatedWords);
      setCurrentCardIndex(0);
      setAppState(AppState.LEARN);
    } catch (error) {
      console.error(error);
      setErrorMsg("生成課程失敗，請稍後再試 (Connection error or Token limit).");
      setAppState(AppState.ERROR);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < words.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setAppState(AppState.QUIZ);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setAppState(AppState.LEARN);
  };

  const handleHome = () => {
    setAppState(AppState.HOME);
    setCurrentCategory(null);
    setWords([]);
  };

  return (
    <Layout onHomeClick={handleHome}>
      {appState === AppState.HOME && (
        <CategoryGrid onSelect={handleSelectCategory} />
      )}

      {appState === AppState.LOADING && (
        <LoadingSpinner message={`正在為您準備 "${currentCategory?.label}" 的課程內容...`} />
      )}

      {appState === AppState.ERROR && (
        <div className="text-center mt-20">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">出錯了</h2>
          <p className="text-gray-600 mb-6">{errorMsg}</p>
          <button 
            onClick={handleHome}
            className="px-6 py-2 bg-turquoise-600 text-white rounded-lg hover:bg-turquoise-700"
          >
            回首頁重試
          </button>
        </div>
      )}

      {appState === AppState.LEARN && words.length > 0 && (
        <Flashcard 
          word={words[currentCardIndex]}
          onNext={handleNextCard}
          onPrev={handlePrevCard}
          isFirst={currentCardIndex === 0}
          isLast={currentCardIndex === words.length - 1}
          currentIndex={currentCardIndex}
          total={words.length}
        />
      )}

      {appState === AppState.QUIZ && words.length > 0 && (
        <Quiz 
          words={words}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </Layout>
  );
};

export default App;