import { lazy, onMount } from 'solid-js';
import { Route, Routes, useNavigate } from '@solidjs/router';
import { invoke } from '@tauri-apps/api';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { useAuthStore } from './stores/auth';
import { createAuthSignal } from './hooks/create-auth-signal';

const Auth = lazy(() => import('./pages/auth'));
const Main = lazy(() => import('./pages/main'));

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const [, setAuthStore] = useAuthStore();

  onMount(() => {
    invoke('init_spotlight_window');
  });

  createAuthSignal(data => {
    if (data) {
      setAuthStore({
        id: data.user.id,
        login: data.user.login,
        token: data.token,
      });
    }
    navigate(data ? '/main' : '/auth');
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div class="bg-[#22272e] text-[#adbac7] h-screen rounded-md overflow-hidden">
        <Routes>
          <Route path="/" />
          <Route path="/auth" component={Auth} />
          <Route path="/main" component={Main} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
