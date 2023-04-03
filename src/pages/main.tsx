import { batch, createEffect, createSignal, For, Show } from 'solid-js';
import { format, formatDistanceToNow } from 'date-fns';
import { PullItem } from '../components/github/pull-item';
import { Spinner } from '../components/spinner';
import { createLocalStorageSignal } from '../hooks/createLocal-storage-signal';
import { fetchPullRequestsBy } from '../utils/github-api';
import { PullRequestListViewItem } from '../models/pull-request-list-view-item';

function Main() {
  const [token] = createLocalStorageSignal<{github: string}>('token');
  const [pullRequests, setPullRequests] = createSignal<PullRequestListViewItem[]>();
  const [lastUpdatedAt, setLastUpdatedAt] = createSignal<Date>();
  
  createEffect(() => {
    const githubToken = token()?.github;
    if (githubToken) {
      fetchPullRequestsBy(githubToken)
        .then(async (data) => {
          const viewItems = await Promise.all(data.items.map(issueItem => {
            const viewItem = new PullRequestListViewItem(issueItem);
            return viewItem.loadReviewerCount(githubToken).then(() => viewItem);
          }));

          batch(() => {
            setPullRequests(viewItems);
            setLastUpdatedAt(new Date());
          });
        });
    }
  });

  const handleClickAdd = () => {
    console.log('add');
  };
  
  return (
    <div class="w-full">
      <div class="bg-[#2d333b] px-1 pt-1 border border-[#373e47]">
        <div
          class="inline-block p-1 cursor-pointer"
          onClick={() => handleClickAdd()}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18M12 18V6" stroke="#768390" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <Show when={!!lastUpdatedAt()}>
        <div class="py-2">
          <p class="text-[#768390] text-[10px] text-center">
            {`마지막 업데이트 ${format(lastUpdatedAt() as Date, 'yyyy년 MM월 dd일 HH시 mm분')}`}
          </p>
        </div>
      </Show>
      <ul class="divide-y divide-[#373e47]">
        <For each={pullRequests()} fallback={<Spinner />}>
          {item => (
            <PullItem
              title={item.title}
              subtitle={item.organization}
              timestamp={formatDistanceToNow(item.createdAt)}
              approved={item.approvedCount === item.reviewerCount}
              titleUrl={item.htmlUrl}
              subtitleUrl={`https://github.com/${item.organization}`}
            />
          )}
        </For>
      </ul>
    </div>
  );
}

export default Main;
