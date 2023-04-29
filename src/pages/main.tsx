import { For, Show } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { format, formatDistanceToNow } from 'date-fns';
import { PullItem } from '../components/github/pull-item';
import { Spinner } from '../components/common/spinner';
import { Header } from '../components/github/header';
import { AuthStore, useAuthStore } from '../stores/auth';
import { fetchPullRequestsBy, fetchRequestedPullRequests, fetchReviewedPullRequests } from '../utils/github-api';
import { PullRequestListViewItem } from '../models/pull-request-list-view-item';
import { createTabsSignal, TabKey } from '../hooks/create-tabs-signal';

const WINDOW_HEIGHT = 500;
const HEADER_HEIGHT = 44;

function Main() {
  const tabState = createTabsSignal();
  const [authStore] = useAuthStore();

  const countQuery = createQuery<unknown, unknown, Record<TabKey, number>>(() => ['counts'], async () => {
    const { token, login } = authStore() as AuthStore;

    const [myPulls, requestedPulls, reviewedPulls] = await Promise.all([
      fetchPullRequestsBy(token),
      fetchRequestedPullRequests(token),
      fetchReviewedPullRequests(token, login),
    ]);

    return {
      [TabKey.MY_PULL_REQUESTS]: myPulls.total_count,
      [TabKey.REQUESTED_PULL_REQUESTS]: requestedPulls.total_count,
      [TabKey.REVIEWED_PULL_REQUESTS]: reviewedPulls.reviewedItems.length,
      [TabKey.APPROVED_PULL_REQUESTS]: reviewedPulls.approvedItems.length,
    };
  }, {
    get enabled() {
      return !!authStore();
    },
  });

  const query = createQuery(() => ['pulls', tabState().activeTab], async ({ queryKey }) => {
    const [_, activeTab] = queryKey;
    const { token, login } = authStore() as AuthStore;

    if (activeTab === TabKey.MY_PULL_REQUESTS) {
      const data = await fetchPullRequestsBy(token);
      const viewItems = await Promise.all(data.items.map(issueItem => {
        const viewItem = new PullRequestListViewItem(issueItem);
        return viewItem.loadReviewerCount(token).then(() => viewItem);
      }));
      return viewItems;
    } else if (activeTab === TabKey.REQUESTED_PULL_REQUESTS) {
      const data = await fetchRequestedPullRequests(token);
      const viewItems = data.items.map(issueItem => new PullRequestListViewItem(issueItem));
      return viewItems;
    } else if (activeTab === TabKey.REVIEWED_PULL_REQUESTS) {
      const { reviewedItems } = await fetchReviewedPullRequests(token, login);
      const reviewedViewItems = reviewedItems.map(issueItem => new PullRequestListViewItem(issueItem));
      return reviewedViewItems;
    } else if (activeTab === TabKey.APPROVED_PULL_REQUESTS) {
      const { approvedItems } = await fetchReviewedPullRequests(token, login);
      const approvedViewItems = approvedItems.map(issueItem => new PullRequestListViewItem(issueItem));
      return approvedViewItems;
    }
  }, {
    get enabled() {
      return !!authStore();
    },
  });

  return (
    <div class="w-full">
      <Header
        tabs={tabState().tabs.map(tab => ({ ...tab, count: countQuery.data?.[tab.key] }))}
        activeTab={tabState().activeTab}
      />

      <div style={{ height: `${WINDOW_HEIGHT - HEADER_HEIGHT}px` }} class="overflow-y-auto">
        <Show when={query.dataUpdatedAt}>
          <div class="py-2">
            <p class="text-[#768390] text-[10px] text-center">
              {`Last Update ${format(query.dataUpdatedAt, 'HH\'h\' mm\'m\' ss\'s\'')}`}
            </p>
          </div>
        </Show>
        <Show when={!query.isLoading} fallback={<Spinner />}>
          <Show when={query.data && query.data.length === 0}>
            <div class="p-24">
              <p class="text-[#768390] text-sm text-center">
                {'데이터가 없습니다.'}
              </p>
            </div>
          </Show>
          <Show when={query.data && query.data.length !== 0}>
            <ul class="divide-y divide-[#373e47]">
              <For each={query.data}>
                {item => (
                  <PullItem
                    title={item.title}
                    subtitle={item.organization}
                    caption={`${item.login} · ${formatDistanceToNow(item.createdAt)}`}
                    approved={!!(item.approvedCount && item.reviewerCount) && item.approvedCount === item.reviewerCount}
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
