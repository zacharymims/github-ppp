import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TrialStore {
  trialsUsed: number;
  incrementTrial: () => boolean;
  hasTrialsLeft: () => boolean;
  getTrialsLeft: () => number;
}

export const useTrialStore = create<TrialStore>()(
  persist(
    (set, get) => ({
      trialsUsed: 0,

      incrementTrial: () => {
        const currentTrials = get().trialsUsed;
        if (currentTrials >= 3) return false;
        
        set({ trialsUsed: currentTrials + 1 });
        return true;
      },

      hasTrialsLeft: () => {
        return get().trialsUsed < 3;
      },

      getTrialsLeft: () => {
        return Math.max(3 - get().trialsUsed, 0);
      }
    }),
    {
      name: 'trial-storage'
    }
  )
);