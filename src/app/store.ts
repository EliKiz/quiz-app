import { create } from 'zustand';

export interface Category {
  id: number;
  name: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export interface TriviaCategoryApi {
  id: number;
  name: string;
}

export interface TriviaCategoriesResponse {
  trivia_categories: TriviaCategoryApi[];
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('https://opentdb.com/api_category.php');
      const data: TriviaCategoriesResponse = await res.json();
      set({
        categories: data.trivia_categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        })),
        loading: false,
        error: null,
      });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Failed to load categories' });
    }
  },
}));

export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

interface QuizState {
  questions: QuizQuestion[];
  current: number;
  correct: number;
  incorrect: number;
  loading: boolean;
  error: string | null;
  fetchQuestions: (params: { category: number; amount?: number; difficulty?: string; type?: string }) => Promise<void>;
  answer: (answer: string) => void;
  resetQuiz: () => void;
}

export interface TriviaQuestionApi {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface TriviaQuestionsResponse {
  response_code: number;
  results: TriviaQuestionApi[];
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  current: 0,
  correct: 0,
  incorrect: 0,
  loading: false,
  error: null,
  fetchQuestions: async ({ category, amount = 5, difficulty = "easy", type = "multiple" }) => {
    set({ loading: true, error: null, questions: [], current: 0, correct: 0, incorrect: 0 });
    try {
      const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
      const res = await fetch(url);
      const data: TriviaQuestionsResponse = await res.json();
      if (data.response_code !== 0) throw new Error("No questions found");
      const questions = data.results.map((q) => ({
        ...q,
        all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
      }));
      set({ questions, loading: false, error: null });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Failed to load questions" });
    }
  },
  answer: (answer: string) => {
    const { questions, current, correct, incorrect } = get();
    const isCorrect = questions[current].correct_answer === answer;
    set({
      correct: isCorrect ? correct + 1 : correct,
      incorrect: !isCorrect ? incorrect + 1 : incorrect,
      current: current + 1,
    });
  },
  resetQuiz: () => set({ questions: [], current: 0, correct: 0, incorrect: 0, loading: false, error: null }),
}));

function shuffle(array: string[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export interface GameSettings {
  player: string;
  rounds: number;
  questions: number;
  level: string;
  category: number | null;
}

interface SettingsState {
  settings: GameSettings;
  setSettings: (settings: GameSettings) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    player: '',
    rounds: 3,
    questions: 3,
    level: 'easy',
    category: null,
  },
  setSettings: (settings) => set({ settings }),
})); 