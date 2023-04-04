import { createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createLocalStorageSignal } from '../hooks/createLocal-storage-signal';

function Home() {
  const navigate = useNavigate();
  const [token] = createLocalStorageSignal<{github: string}>('token');

  createEffect(() => {
    if (!token()) {
      return;
    }
    const githubToken = token()?.github;

    navigate(githubToken ? '/main' : '/auth');
  });

  return null;
}

export default Home;
