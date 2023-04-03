import { createEffect, createSignal, For } from 'solid-js';
import { formatDistanceToNow } from 'date-fns';
import { PullItem } from '../components/github/pull-item';
import { Spinner } from '../components/spinner';
import { createLocalStorageSignal } from '../hooks/createLocal-storage-signal';
import { fetchPullsBy } from '../utils/github-api';
import type { IPull } from '../types/github';

function Main() {
  const [token] = createLocalStorageSignal<{github: string}>('token');
  const [pulls, setPulls] = createSignal<IPull[]>();
  
  createEffect(() => {
    fetchPullsBy(token()?.github || '')
      .then(data => {
        setPulls(data);
      });
  });

  const handleClickAdd = () => {
    console.log('add');
  };
  
  return (
    <div class="w-full">
      <div
        class="bg-[#2d333b] px-1 pt-1 border border-[#373e47]"
        onClick={() => handleClickAdd()}
      >
        <div class="inline-block p-1 cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18M12 18V6" stroke="#768390" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <ul class="divide-y divide-[#373e47]">
        <For each={pulls()} fallback={<Spinner />}>
          {item => (
            <PullItem
              title={item.title}
              subtitle={`${item.owner}/${item.repo}`}
              timestamp={formatDistanceToNow(new Date(item.createdAt))}
              approved={item.approved}
              titleUrl={item.url}
              subtitleUrl={`https://github.com/${item.owner}/${item.repo}`}
            />
          )}
        </For>
      </ul>
    </div>
  );
}

export default Main;
