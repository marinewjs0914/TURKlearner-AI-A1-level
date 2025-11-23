import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick }) => {
  return (
    <div className="min-h-screen flex flex-col bg-sand-100 text-gray-800">
      <header className="bg-turquoise-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={onHomeClick}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl">🇹🇷</span>
            <h1 className="text-xl font-bold tracking-tight">TurkLearner AI</h1>
          </div>
          <nav>
            <button 
              onClick={onHomeClick}
              className="text-sm font-medium hover:bg-turquoise-700 px-3 py-1.5 rounded-md transition-colors"
            >
              回首頁
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-6 w-full max-w-4xl mx-auto">
        {children}
      </main>
      <footer className="bg-sand-200 text-center py-4 text-sm text-gray-600">
        <p>Powered by Google Gemini 2.5 • Learning Turkish made easy</p>
      </footer>
    </div>
  );
};

export default Layout;