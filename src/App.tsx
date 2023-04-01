import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { Show } from 'solid-js';
import AuthPage from './pages/auth';
import MainPage from './pages/main';
import { Spinner } from './components/spinner';
import { createLocalStorageSignal } from './hooks/createLocal-storage-signal';

const queryClient = new QueryClient();

export function App() {
  const [token, setToken] = createLocalStorageSignal<{github: string}>('token');

  const handleSubmit = async (token: string) => {
    setToken(prevToken => ({
      ...prevToken,
      github: token,
    }));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div class="bg-[#22272e] text-[#adbac7] h-screen rounded-md overflow-hidden">
        <Show when={!!token()} fallback={<Spinner />}>
          {!token()?.github ? (
            <AuthPage onSubmit={handleSubmit} />
          ) : (
            <MainPage />
          )}
        </Show>
      </div>
    </QueryClientProvider>
  );
}
