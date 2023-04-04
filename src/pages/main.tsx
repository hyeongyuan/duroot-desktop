import { batch, createEffect, createSignal, For, Show } from 'solid-js';
import { format, formatDistanceToNow } from 'date-fns';
import { PullItem } from '../components/github/pull-item';
import { Spinner } from '../components/spinner';
import { Header } from '../components/github/header';
import { useAuthStore } from '../stores/auth';
import { fetchPullRequestsBy, fetchRequestedPullRequests } from '../utils/github-api';
import { PullRequestListViewItem } from '../models/pull-request-list-view-item';
import { createTabsSignal, TabKey } from '../hooks/create-tabs-signal';

const WINDOW_HEIGHT = 500;
const HEADER_HEIGHT = 44;

function Main() {
  const tabState = createTabsSignal();
  const [lastUpdatedAt, setLastUpdatedAt] = createSignal<Date>();
  const [myPullRequests, setMyPullRequests] = createSignal<PullRequestListViewItem[]>();
  const [requestedPullRequests, setRequestedPullRequests] = createSignal<PullRequestListViewItem[]>();
  const [authStore] = useAuthStore();

  createEffect(() => {
    const githubToken = authStore()?.token;
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

  return (
    <div class="w-full">
      <Header tabs={tabState().tabs} activeTab={tabState().activeTab} />

      <div style={{ height: `${WINDOW_HEIGHT - HEADER_HEIGHT}px` }} class="overflow-y-auto">
        <Show when={!!lastUpdatedAt()}>
          <div class="py-2">
            <p class="text-[#768390] text-[10px] text-center">
              {`마지막 업데이트 ${format(lastUpdatedAt() as Date, 'yyyy년 MM월 dd일 HH시 mm분')}`}
            </p>
          </div>
        </Show>
        <Show when={myPullRequests() && requestedPullRequests()} fallback={<Spinner />}>
          <Show when={tabState().activeTab === TabKey.MY_PULL_REQUESTS &&  myPullRequests()?.length !== 0}>
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
          <Show when={tabState().activeTab === TabKey.REQUESTED_PULL_REQUESTS && requestedPullRequests()?.length !== 0}>
            <ul class="divide-y divide-[#373e47]">
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
    </div>
  );
}

export default Main;
