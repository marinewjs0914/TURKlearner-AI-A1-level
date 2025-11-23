import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "正在生成課程..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-turquoise-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-turquoise-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-turquoise-800 font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;