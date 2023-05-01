import { For, Match, Show, Switch, createEffect, createResource, onMount } from 'solid-js';
import { format, formatDistanceToNow } from 'date-fns';
import { PullItem } from '../components/github/pull-item';
import { MyPullItem } from '../components/github/my-pull-item';
import { Spinner } from '../components/common/spinner';
import { Header } from '../components/github/header';
import { useAuthStore } from '../stores/auth';
import { fetchPullRequestsBy, fetchRequestedPullRequests, fetchReviewedPullRequests } from '../utils/github-api';
import { createTabsSignal, TabKey } from '../hooks/create-tabs-signal';

const WINDOW_HEIGHT = 500;
const HEADER_HEIGHT = 44;

function Main() {
  const tabState = createTabsSignal();
  const [authStore] = useAuthStore();

  const [myPulls, { refetch: myPullsRefetch }] = createResource(authStore, async (source) => {
    const data = await fetchPullRequestsBy(source.token);
    return {
      data,
      dataUpdatedAt: new Date(),
    };
  });
  const [requestedPulls, { refetch: requestedPullsRefetch }] = createResource(authStore, async (source) => {
    const data = await fetchRequestedPullRequests(source.token);
    return {
      data,
      dataUpdatedAt: new Date(),
    };
  });
  const [reviewedPulls, { refetch: reviewedPullsRefetch }] = createResource(authStore, async (source) => {
    const data = await fetchReviewedPullRequests(source.token, source.login);
    return {
      data,
      dataUpdatedAt: new Date(),
    };
  });

  createEffect(() => {
    switch (tabState().activeTab) {
      case TabKey.MY_PULL_REQUESTS:
        myPullsRefetch();
        break;
      case TabKey.REQUESTED_PULL_REQUESTS:
        requestedPullsRefetch();
        break;
      default:
        reviewedPullsRefetch();
    }
  });

  onMount(() => {
    window.addEventListener('focus', () => {
      myPullsRefetch();
      requestedPullsRefetch();
      reviewedPullsRefetch();
    });
  });

  
  return (
    <div class="w-full">
      <Header
        tabs={tabState().tabs.map(tab => {
          const tabCounts: Record<TabKey, number> = {
            [TabKey.MY_PULL_REQUESTS]: myPulls()?.data.total_count ?? 0,
            [TabKey.REQUESTED_PULL_REQUESTS]: requestedPulls()?.data.total_count ?? 0,
            [TabKey.REVIEWED_PULL_REQUESTS]: reviewedPulls()?.data.reviewedItems.length ?? 0,
            [TabKey.APPROVED_PULL_REQUESTS]: reviewedPulls()?.data.approvedItems.length ?? 0,
          };
          return {
            ...tab,
            count: tabCounts[tab.key],
          };
        })}
        activeTab={tabState().activeTab}
      />
      <div style={{ height: `${WINDOW_HEIGHT - HEADER_HEIGHT}px` }} class="overflow-y-auto">
        <Switch>
          <Match when={tabState().activeTab === TabKey.MY_PULL_REQUESTS}>
            <Show when={!!myPulls()} fallback={<Spinner />}>
              <div class="py-2">
                <p class="text-[#768390] text-[10px] text-center">
                  {`Last Update ${format(myPulls()?.dataUpdatedAt || new Date(), 'HH\'h\' mm\'m\' ss\'s\'')}`}
                </p>
              </div>
              <Show when={myPulls()?.data.items.length === 0}>
                <div class="p-24">
                  <p class="text-[#768390] text-sm text-center">
                    {'데이터가 없습니다.'}
                  </p>
                </div>
              </Show>
              <Show when={myPulls()?.data.items.length !== 0}>
                <ul class="divide-y divide-[#373e47]">
                  <For each={myPulls()?.data.items}>
                    {item => {
                      const [repo, owner] = item.repository_url.split('/').reverse();
                      const ownerRepo = `${owner}/${repo}`;
                      return (
                        <MyPullItem
                          id={item.id}
                          title={item.title}
                          titleUrl={item.html_url}
                          subtitle={ownerRepo}
                          subtitleUrl={`https://github.com/${ownerRepo}`}
                          caption={formatDistanceToNow(new Date(item.created_at))}
                          pullRequestUrl={item.pull_request.url}
                        />
                      );
                    }}
                  </For>
                </ul>
              </Show>
            </Show>
          </Match>
          <Match when={tabState().activeTab === TabKey.REQUESTED_PULL_REQUESTS}>
            <Show when={!!requestedPulls()} fallback={<Spinner />}>
              <div class="py-2">
                <p class="text-[#768390] text-[10px] text-center">
                  {`Last Update ${format(requestedPulls()?.dataUpdatedAt || new Date(), 'HH\'h\' mm\'m\' ss\'s\'')}`}
                </p>
              </div>
              <Show when={requestedPulls()?.data.items.length === 0}>
                <div class="p-24">
                  <p class="text-[#768390] text-sm text-center">
                    {'데이터가 없습니다.'}
                  </p>
                </div>
              </Show>
              <Show when={requestedPulls()?.data.items.length !== 0}>
                <ul class="divide-y divide-[#373e47]">
                  <For each={requestedPulls()?.data.items}>
                    {item => {
                      const [repo, owner] = item.repository_url.split('/').reverse();
                      const ownerRepo = `${owner}/${repo}`;
                      return (
                        <PullItem
                          title={item.title}
                          titleUrl={item.html_url}
                          subtitle={ownerRepo}
                          subtitleUrl={`https://github.com/${ownerRepo}`}
                          caption={`${item.user.login} · ${formatDistanceToNow(new Date(item.created_at))}`}
                        />
                      );
                    }}
                  </For>
                </ul>
              </Show>
            </Show>
          </Match>
          <Match when={tabState().activeTab === TabKey.REVIEWED_PULL_REQUESTS}>
            <Show when={!!reviewedPulls()} fallback={<Spinner />}>
              <div class="py-2">
                <p class="text-[#768390] text-[10px] text-center">
                  {`Last Update ${format(reviewedPulls()?.dataUpdatedAt || new Date(), 'HH\'h\' mm\'m\' ss\'s\'')}`}
                </p>
              </div>
              <Show when={reviewedPulls()?.data.reviewedItems.length === 0}>
                <div class="p-24">
                  <p class="text-[#768390] text-sm text-center">
                    {'데이터가 없습니다.'}
                  </p>
                </div>
              </Show>
              <Show when={reviewedPulls()?.data.reviewedItems.length !== 0}>
                <ul class="divide-y divide-[#373e47]">
                  <For each={reviewedPulls()?.data.reviewedItems}>
                    {item => {
                      const [repo, owner] = item.repository_url.split('/').reverse();
                      const ownerRepo = `${owner}/${repo}`;
                      return (
                        <PullItem
                          title={item.title}
                          titleUrl={item.html_url}
                          subtitle={ownerRepo}
                          subtitleUrl={`https://github.com/${ownerRepo}`}
                          caption={`${item.user.login} · ${formatDistanceToNow(new Date(item.created_at))}`}
                        />
                      );
                    }}
                  </For>
                </ul>
              </Show>
            </Show>
          </Match>
          <Match when={tabState().activeTab === TabKey.APPROVED_PULL_REQUESTS}>
            <Show when={!!reviewedPulls()} fallback={<Spinner />}>
              <div class="py-2">
                <p class="text-[#768390] text-[10px] text-center">
                  {`Last Update ${format(reviewedPulls()?.dataUpdatedAt || new Date(), 'HH\'h\' mm\'m\' ss\'s\'')}`}
                </p>
              </div>
              <Show when={reviewedPulls()?.data.approvedItems.length === 0}>
                <div class="p-24">
                  <p class="text-[#768390] text-sm text-center">
                    {'데이터가 없습니다.'}
                  </p>
                </div>
              </Show>
              <Show when={reviewedPulls()?.data.approvedItems.length !== 0}>
                <ul class="divide-y divide-[#373e47]">
                  <For each={reviewedPulls()?.data.approvedItems}>
                    {item => {
                      const [repo, owner] = item.repository_url.split('/').reverse();
                      const ownerRepo = `${owner}/${repo}`;
                      return (
                        <PullItem
                          title={item.title}
                          titleUrl={item.html_url}
                          subtitle={ownerRepo}
                          subtitleUrl={`https://github.com/${ownerRepo}`}
                          caption={`${item.user.login} · ${formatDistanceToNow(new Date(item.created_at))}`}
                        />
                      );
                    }}
                  </For>
                </ul>
              </Show>
            </Show>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

export default Main;
