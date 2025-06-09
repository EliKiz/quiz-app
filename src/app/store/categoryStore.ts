import { create } from "zustand";
import { ICategoryState, ITriviaCategoriesResponse } from "../../shared/types/types";

export const useCategoryStore = create<ICategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://opentdb.com/api_category.php");
      const data: ITriviaCategoriesResponse = await res.json();
      set({
        categories: data.trivia_categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        })),
        loading: false,
        error: null,
      });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to load categories",
      });
    }
  },
})); 