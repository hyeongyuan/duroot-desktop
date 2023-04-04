import { Accessor, Setter, createSignal } from 'solid-js';

interface AuthStore {
  token: string;
  login: string;
}

const [authStore, setAuthStore] = createSignal<AuthStore | null>(null);

export const useAuthStore = (): [Accessor<AuthStore | null>, Setter<AuthStore | null>] => [authStore, setAuthStore];
