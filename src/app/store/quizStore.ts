import { create } from "zustand";
import { IQuizState, ITriviaQuestionsResponse } from "../../shared/types/types";

export const useQuizStore = create<IQuizState>((set, get) => ({
  questions: [],
  current: 0,
  correct: 0,
  incorrect: 0,
  loading: false,
  error: null,
  fetchQuestions: async ({ category, amount = 5, difficulty, type }) => {
    set({ loading: true, error: null });
    try {
      const params = [
        `amount=${amount}`,
        category ? `category=${category}` : null,
        difficulty ? `difficulty=${difficulty}` : null,
        type ? `type=${type}` : null,
      ]
        .filter(Boolean)
        .join("&");
      const url = `https://opentdb.com/api.php?${params}`;
      const res = await fetch(url);
      const data: ITriviaQuestionsResponse = await res.json();
      if (data.response_code !== 0) throw new Error("No questions found");
      const questions = data.results.map((q) => ({
        ...q,
        all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
      }));
      set({ questions, loading: false, error: null, current: 0, correct: 0, incorrect: 0 });
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
  resetQuiz: () =>
    set({
      questions: [],
      current: 0,
      correct: 0,
      incorrect: 0,
      loading: false,
      error: null,
    }),
}));

export const shuffle = (array: string[]): string[] =>
  array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value); 