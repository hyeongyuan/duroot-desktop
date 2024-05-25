import { create } from 'zustand';

interface AuthStare {
  data?: string;
  setData: (data: string) => void;
}

export const useTokenStore = create<AuthStare>((set) => ({
  setData: (data) => set({ data })
}));
