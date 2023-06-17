import { lazy, onCleanup, onMount } from 'solid-js';
import { Route, Routes, useNavigate } from '@solidjs/router';
import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { sendNotification } from '@tauri-apps/api/notification';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { useAuthStore } from './stores/auth';
import { createAuthSignal } from './hooks/create-auth-signal';
import { fetchRequestedPullRequests } from './utils/github-api';

const Auth = lazy(() => import('./pages/auth'));
const Pulls = lazy(() => import('./pages/pulls'));

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const [authStore, setAuthStore] = useAuthStore();

  onMount(() => {
    invoke('init_spotlight_window');
  });

  onMount(async () => {
    const unlisten = await listen('notification', async () => {
      const token = authStore()?.token;
      if (!token) {
        return;
      }
      const data = await fetchRequestedPullRequests(token);
      if (data.total_count === 0) {
        return;
      }
      sendNotification({ title: 'Duroot', body: `리뷰를 기다히는 PR ${data.total_count}개` });
    });
    onCleanup(() => {
      unlisten();
    });
  });
  
  createAuthSignal(data => {
    if (data) {
      setAuthStore({
        id: data.user.id,
        login: data.user.login,
        token: data.token,
      });
    }
    navigate(data ? '/pulls' : '/auth');
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div class="bg-[#22272e] text-[#adbac7] h-screen rounded-md overflow-hidden">
        <Routes>
          <Route path="/" />
          <Route path="/auth" component={Auth} />
          <Route path="/pulls" component={Pulls} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
