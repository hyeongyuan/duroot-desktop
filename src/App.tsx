import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { createEffect, createSignal, Show } from 'solid-js';
import AuthPage from './pages/auth';
import MainPage from './pages/main';
import { getAllDatabase, IDatabase, updateDatabase } from './utils/database';

const queryClient = new QueryClient();

function App() {
  const [database, setDatabase] = createSignal<IDatabase>();

  createEffect(async () => {
    const data = await getAllDatabase();
    
    setDatabase(data || {});
  });

  const handleSubmit = async (token: string) => {
    await updateDatabase('token.github', token);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div class="flex bg-[#2f2f2f] text-[#f6f6f6] h-screen rounded">
        <Show when={!!database()} fallback={<div>Loading ...</div>}>
          {!database()?.token?.github ? (
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
