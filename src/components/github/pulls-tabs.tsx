'use client';

import { fetchPullRequestsBy, fetchRequestedPullRequests, fetchReviewedPullRequests } from '@/apis/github';
import { Tab, Tabs } from '@/components/common/tabs';
import { useAuthStore } from '@/stores/auth';
import { useTokenStore } from '@/stores/token';
import { useQueries } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export enum TabKey {
  MY_PULL_REQUESTS = 'myPullRequests',
  REQUESTED_PULL_REQUESTS = 'requestedPullRequests',
  REVIEWED_PULL_REQUESTS = 'reviewedPullRequests',
  APPROVED_PULL_REQUESTS = 'approvedPullRequests',
}

export function  PullsTabs() {
  const searchParams = useSearchParams();
  const tabQuery = (searchParams.get('tab') || TabKey.MY_PULL_REQUESTS)as TabKey;
  const { data: token } = useTokenStore();
  const { data: auth } = useAuthStore();

  const [myPulls, requestedPulls, reviewedPulls, approvedPulls] = useQueries({ queries: [
    {
      queryKey: ['pulls', TabKey.MY_PULL_REQUESTS],
      queryFn: async () => {
        const { items } = await fetchPullRequestsBy(token!);
        return {
          items,
          lastUpdatedAt: new Date(),
        };
      },
      enabled: !!token,
    },
    {
      queryKey: ['pulls', TabKey.REQUESTED_PULL_REQUESTS],
      queryFn: async () => {
        const { items } = await fetchRequestedPullRequests(token!);
        return {
          items,
          lastUpdatedAt: new Date(),
        };
      },
      enabled: !!token,
    },
    {
      queryKey: ['pulls', TabKey.REVIEWED_PULL_REQUESTS],
      queryFn: async () => {
        const { reviewedItems } = await fetchReviewedPullRequests(token!, auth?.login);
        return {
          items: reviewedItems,
          lastUpdatedAt: new Date(),
        };
      },
      enabled: !!token,
    },
    {
      queryKey: ['pulls', TabKey.APPROVED_PULL_REQUESTS],
      queryFn: async () => {
        const { approvedItems } = await fetchReviewedPullRequests(token!, auth?.login);
        return {
          items: approvedItems,
          lastUpdatedAt: new Date(),
        };
      },
      enabled: !!token,
    },
  ] });

  const tabs: Tab[] = [
    {
      key: TabKey.MY_PULL_REQUESTS,
      name: 'My',
      href: `/pulls?tab=${TabKey.MY_PULL_REQUESTS}`,
      count: myPulls.data?.items.length,
    },
    {
      key: TabKey.REQUESTED_PULL_REQUESTS,
      name: 'Requested',
      href: `/pulls?tab=${TabKey.REQUESTED_PULL_REQUESTS}`,
      count: requestedPulls.data?.items.length,
    },
    {
      key: TabKey.REVIEWED_PULL_REQUESTS,
      name: 'Reviewed',
      href: `/pulls?tab=${TabKey.REVIEWED_PULL_REQUESTS}`,
      count: reviewedPulls.data?.items.length,
    },
    {
      key: TabKey.APPROVED_PULL_REQUESTS,
      name: 'Approved',
      href: `/pulls?tab=${TabKey.APPROVED_PULL_REQUESTS}`,
      count: approvedPulls.data?.items.length,
    }
  ];

  return (
    <Tabs data={tabs} activeTab={tabQuery} />
  );
}
