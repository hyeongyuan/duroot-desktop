import { lazy } from 'solid-js';
import { Route, Routes } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const Home = lazy(() => import('./pages/home'));
const Auth = lazy(() => import('./pages/auth'));
const Main = lazy(() => import('./pages/main'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div class="bg-[#22272e] text-[#adbac7] h-screen rounded-md overflow-hidden">
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/main" component={Main} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
