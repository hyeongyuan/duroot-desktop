import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { createSignal, Show } from 'solid-js';
import AuthPage from './pages/auth';
import MainPage from './pages/main';

const queryClient = new QueryClient();

function App() {
  const [token, setToken] = createSignal();
  return (
    <QueryClientProvider client={queryClient}>
      <div class="flex bg-[#2f2f2f] text-[#f6f6f6] h-screen rounded">
        <Show when={!!token()} fallback={<AuthPage onSubmit={setToken} />}>
          <MainPage />
        </Show>
      </div>
    </QueryClientProvider>
  );
}

export default App;
