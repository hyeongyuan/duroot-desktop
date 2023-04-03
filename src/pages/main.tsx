import { batch, createEffect, createSignal, For, Show } from 'solid-js';
import { format, formatDistanceToNow } from 'date-fns';
import { PullItem } from '../components/github/pull-item';
import { Spinner } from '../components/spinner';
import { createLocalStorageSignal } from '../hooks/createLocal-storage-signal';
import { fetchPullRequestsBy, fetchRequestedPullRequests } from '../utils/github-api';
import { PullRequestListViewItem } from '../models/pull-request-list-view-item';

function Main() {
  const [token] = createLocalStorageSignal<{github: string}>('token');
  const [lastUpdatedAt, setLastUpdatedAt] = createSignal<Date>();
  const [myPullRequests, setMyPullRequests] = createSignal<PullRequestListViewItem[]>();
  const [requestedPullRequests, setRequestedPullRequests] = createSignal<PullRequestListViewItem[]>();
  
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
            setMyPullRequests(viewItems);
            setLastUpdatedAt(new Date());
          });
        });

      fetchRequestedPullRequests(githubToken)
        .then(async (data) => {
          const viewItems = data.items.map(issueItem => new PullRequestListViewItem(issueItem));
          setRequestedPullRequests(viewItems);
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
      <Show when={myPullRequests() && requestedPullRequests()} fallback={<Spinner />}>
        <Show when={myPullRequests()?.length !== 0}>
          <div class="px-4 pt-2">
            <p class="text-[10px] border-bottom">
              내가 만든 PR
            </p>
          </div>
          <ul class="divide-y divide-[#373e47]">
            <For each={myPullRequests()}>
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
        </Show>
        <Show when={requestedPullRequests()?.length !== 0}>
          <ul class="divide-y divide-[#373e47]">
            <div class="px-4 pt-2">
              <p class="text-[10px] border-bottom">
                내 리뷰를 기다리는 PR
              </p>
            </div>
            <For each={requestedPullRequests()}>
              {item => (
                <PullItem
                  title={item.title}
                  subtitle={item.organization}
                  timestamp={formatDistanceToNow(item.createdAt)}
                  titleUrl={item.htmlUrl}
                  subtitleUrl={`https://github.com/${item.organization}`}
                />
              )}
            </For>
          </ul>
        </Show>
      </Show>
    </div>
  );
}

export default Main;
