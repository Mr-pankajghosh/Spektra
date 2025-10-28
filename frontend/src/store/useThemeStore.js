import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Spektra-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Spektra-theme", theme);
    set({ theme });
  },
}));