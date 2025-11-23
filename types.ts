export interface VocabWord {
  turkish: string;
  chinese: string;
  pronunciation: string; // Phonetic or rough guide
  exampleSentence: string;
  exampleTranslation: string;
}

export enum AppState {
  HOME = 'HOME',
  LOADING = 'LOADING',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  ERROR = 'ERROR'
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  promptTopic: string;
}

export type QuizResult = {
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
};

export interface PronunciationResult {
  score: number;
  feedback: string;
}