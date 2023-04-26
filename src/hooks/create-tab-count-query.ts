import { createQueries } from '@tanstack/solid-query';
import { useAuthStore } from '../stores/auth';
import { fetchPullRequestsBy, fetchRequestedPullRequests, fetchReviewedPullRequests } from '../utils/github-api';
import { TabKey } from './create-tabs-signal';

export const createTabCountQuery = () => {
  const [authStore] = useAuthStore();
  const githubToken = authStore()?.token;
  const githubLogin = authStore()?.login;

  const [myPulls, requestedPulls, reviewedPulls] = createQueries({
    queries: [
      {
        queryKey:() => ['my-pulls'],
        queryFn: () => fetchPullRequestsBy(githubToken as string),
        enabled: !!githubToken,
      },
      {
        queryKey:() => ['requested-pulls'],
        queryFn: () => fetchRequestedPullRequests(githubToken as string),
        enabled: !!githubToken,
      },
      {
        queryKey:() => ['reviewed-pulls'],
        queryFn: () => fetchReviewedPullRequests(githubToken as string, githubLogin),
        enabled: !!(githubToken && githubLogin),
      },
    ],
  });

  return {
    [TabKey.MY_PULL_REQUESTS]: myPulls.data?.total_count,
    [TabKey.REQUESTED_PULL_REQUESTS]: requestedPulls.data?.total_count,
    [TabKey.REVIEWED_PULL_REQUESTS]: reviewedPulls.data?.reviewedItems.length,
    [TabKey.APPROVED_PULL_REQUESTS]: reviewedPulls.data?.approvedItems.length,
  };
};
