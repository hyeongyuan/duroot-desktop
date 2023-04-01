import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { createEffect, createSignal, Show } from 'solid-js';
import AuthPage from './pages/auth';
import MainPage from './pages/main';
import Spinner from './components/Spinner';
import { getAllDatabase, IDatabase, updateDatabase } from './utils/database';

const queryClient = new QueryClient();

function App() {
  const [database, setDatabase] = createSignal<IDatabase>();

  createEffect(() => {
    getAllDatabase().then(data => {
      console.log(data);
      setDatabase({
        token: {
          github: 'hello'
        }
      });
    });
  });

  const handleSubmit = async (token: string) => {
    await updateDatabase('token.github', token);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div class="flex bg-[#22272e] text-[#adbac7] h-screen rounded">
        <Show when={!!database()} fallback={<Spinner />}>
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
