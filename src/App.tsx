import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { Show } from 'solid-js';
import AuthPage from './pages/auth';
import MainPage from './pages/main';
import Spinner from './components/Spinner';
import createLocalStorageSignal from './hooks/createLocalStorageSignal';

const queryClient = new QueryClient();

function App() {
  const [token, setToken] = createLocalStorageSignal<{github: string}>('token');

  const handleSubmit = async (token: string) => {
    setToken(prevToken => ({
      ...prevToken,
      github: token,
    }));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div class="bg-[#22272e] text-[#adbac7] h-screen rounded overflow-hidden">
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

export default App;
