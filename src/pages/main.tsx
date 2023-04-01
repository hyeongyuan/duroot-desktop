import { open } from '@tauri-apps/api/shell';
import { createEffect, createSignal, For } from 'solid-js';
import { formatDistanceToNow } from 'date-fns';
import { PullItem } from '../components/github/pull-item';
import Spinner from '../components/Spinner';
import createLocalStorageSignal from '../hooks/createLocalStorageSignal';
import { fetchPulls, IPull } from '../utils/github-api';

function Main() {
  const [token] = createLocalStorageSignal<{github: string}>('token');
  const [pulls, setPulls] = createSignal<IPull[]>();
  
  createEffect(() => {
    fetchPulls({owner: 'dunamu-stock', repo: 'stockplus-webview-sdk-fe'}, token()?.github)
      .then(data => {
        setPulls(data);
      });
  });

  const handleClick = (id: number) => {
    const pull = pulls()?.find(pull => pull.id === id);
    if (!pull) {
      return;
    }
    open(pull.url);
  };
  
  return (
    <div class="w-full ov">
      <ul class="divide-y divide-[#373e47]">
        <For each={pulls()} fallback={<Spinner />}>
          {item => (
            <PullItem
              id={item.id}
              title={item.title}
              subtitle={`${item.owner}/${item.repo}`}
              timestamp={formatDistanceToNow(new Date(item.createdAt))}
              approved={item.approved}
              onClick={handleClick}
            />
          )}
        </For>
      </ul>
    </div>
  );
}

export default Main;
