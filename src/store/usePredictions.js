import { create } from 'zustand'

const usePredictions = create((set) => ({
  predictions: [],
  add: (prediction) => set((state) => ({ predictions: [...state.predictions, prediction] })),
  clear: () => set({ predictions: [] }),
}))

export default usePredictions