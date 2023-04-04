import { lazy } from 'solid-js';
import { Route, Routes, useNavigate } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { useAuthStore } from './stores/auth';
import { createAuthSignal } from './hooks/create-auth-signal';

const Auth = lazy(() => import('./pages/auth'));
const Main = lazy(() => import('./pages/main'));

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const [, setAuthStore] = useAuthStore();

  createAuthSignal(data => {
    if (data) {
      setAuthStore({
        token: data.token,
        login: data.user.login,
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
