import { GithubUser } from '@/types/github';
import { create } from 'zustand';

interface AuthStare {
  data: GithubUser | null
  setData: (data: GithubUser | null) => void;
}

export const useAuthStore = create<AuthStare>((set) => ({
  data: null,
  setData: (data) => set({ data })
}));
