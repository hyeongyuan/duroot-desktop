import { Accessor, Setter, createSignal } from 'solid-js';

export interface AuthStore {
  id: number;
  login: string;
  token: string;
}

const [authStore, setAuthStore] = createSignal<AuthStore | null>(null);

export const useAuthStore = (): [Accessor<AuthStore | null>, Setter<AuthStore | null>] => [authStore, setAuthStore];
