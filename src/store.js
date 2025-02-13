import { create } from "zustand";

const useCalculatorStore = create((set) => ({
  input: "",
  updateInput: (value) => set((state) => ({ input: state.input + value })),
  clearInput: () => set({ input: " " }),
  calculateResult: () =>
    set((state) => {
      try {
        return { input: eval(state.input).toString() };
      } catch {
        return { input: "Error" };
      }
    }),
}));

export default useCalculatorStore;
