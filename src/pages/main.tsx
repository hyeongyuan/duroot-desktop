import { open } from '@tauri-apps/api/shell';
import { createEffect, createSignal, For } from 'solid-js';
import { formatDistanceToNow } from 'date-fns';
import { PullItem } from '../components/github/pull-item';
import { Spinner } from '../components/spinner';
import { createLocalStorageSignal } from '../hooks/createLocal-storage-signal';
import { fetchPulls, IPull } from '../utils/github-api';

function Main() {
  const [token] = createLocalStorageSignal<{github: string}>('token');
  const [pulls, setPulls] = createSignal<IPull[]>();
  
  createEffect(() => {
    fetchPulls({ owner: 'dunamu-stock', repo: 'stockplus-webview-sdk-fe' }, token()?.github)
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
    <div class="w-full">
      <div class="p-2">
        <div class="inline-block hover:bg-[#2d333b] p-1 rounded-lg text-right">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18M12 18V6" stroke="#768390" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
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
