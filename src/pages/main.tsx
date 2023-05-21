import { Match, Show, Switch, createEffect, createResource, onCleanup, onMount } from 'solid-js';
import { Spinner } from '../components/common/spinner';
import { HEADER_HEIGHT, Header } from '../components/common/header';
import { TAB_LIST_HEIGHT, TabList } from '../components/github/tab-list';
import { MyPullList } from '../components/github/my-pull-list';
import { PullList } from '../components/github/pull-list';
import { useAuthStore } from '../stores/auth';
import { fetchPullRequestsBy, fetchRequestedPullRequests, fetchReviewedPullRequests } from '../utils/github-api';
import { createTabsSignal, TabKey } from '../hooks/create-tabs-signal';

const WINDOW_HEIGHT = 500;
const HEADER_SECTION_HEIGHT = HEADER_HEIGHT + TAB_LIST_HEIGHT;

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

  const refetchPulls = () => {
    myPullsRefetch();
    requestedPullsRefetch();
    reviewedPullsRefetch();
  };

  onMount(() => {
    window.addEventListener('focus', refetchPulls);
  });

  onCleanup(() => {
    window.removeEventListener('focus', refetchPulls);
  });
  
  return (
    <div class="w-full">
      <Header />
      <TabList
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
      <div style={{ height: `${WINDOW_HEIGHT - HEADER_SECTION_HEIGHT}px` }} class="overflow-y-auto">
        <Switch>
          <Match when={tabState().activeTab === TabKey.MY_PULL_REQUESTS}>
            <Show when={!!myPulls()} fallback={<Spinner />}>
              <MyPullList
                data={myPulls()?.data!}
                dataUpdatedAt={myPulls()?.dataUpdatedAt!}
              />
            </Show>
          </Match>
          <Match when={tabState().activeTab === TabKey.REQUESTED_PULL_REQUESTS}>
            <Show when={!!requestedPulls()} fallback={<Spinner />}>
              <PullList
                data={requestedPulls()?.data!}
                dataUpdatedAt={requestedPulls()?.dataUpdatedAt!}
              />
            </Show>
          </Match>
          <Match when={tabState().activeTab === TabKey.REVIEWED_PULL_REQUESTS}>
            <Show when={!!reviewedPulls()} fallback={<Spinner />}>
              <PullList
                data={reviewedPulls()?.data.reviewedItems!}
                dataUpdatedAt={reviewedPulls()?.dataUpdatedAt!}
              />
            </Show>
          </Match>
          <Match when={tabState().activeTab === TabKey.APPROVED_PULL_REQUESTS}>
            <Show when={!!reviewedPulls()} fallback={<Spinner />}>
              <PullList
                data={reviewedPulls()?.data.approvedItems!}
                dataUpdatedAt={reviewedPulls()?.dataUpdatedAt!}
              />
            </Show>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

export default Main;
