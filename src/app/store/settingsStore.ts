import { create } from "zustand";
import { ISettingsState } from "../../shared/types/types";

export const useSettingsStore = create<ISettingsState>((set) => ({
  settings: {
    player: "",
    amount: 10,
    level: "easy",
    type: "multiple",
    category: "",
  },
  setSettings: (settings) => set({ settings }),
})); 