import { create } from 'zustand';

interface AuthStare {
  data: string | null;
  setData: (data: string | null) => void;
}

export const useTokenStore = create<AuthStare>((set) => ({
  data: null,
  setData: (data) => set({ data })
}));
