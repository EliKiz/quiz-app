export interface ICategory {
  id: number;
  name: string;
}

export interface ICategoryState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export interface ITriviaCategoryApi {
  id: number;
  name: string;
}

export interface ITriviaCategoriesResponse {
  trivia_categories: ITriviaCategoryApi[];
}

export interface IQuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface IQuizState {
  questions: IQuizQuestion[];
  current: number;
  correct: number;
  incorrect: number;
  loading: boolean;
  error: string | null;
  fetchQuestions: (params: {
    category: number;
    amount?: number;
    difficulty?: string;
    type?: string;
  }) => Promise<void>;
  answer: (answer: string) => void;
  resetQuiz: () => void;
}

export interface ITriviaQuestionApi {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface ITriviaQuestionsResponse {
  response_code: number;
  results: ITriviaQuestionApi[];
}

export interface IGameSettings {
  player: string;
  amount: number;
  level: string;
  type: string;
  category: number | string | null;
}

export interface ISettingsState {
  settings: IGameSettings;
  setSettings: (settings: IGameSettings) => void;
} 