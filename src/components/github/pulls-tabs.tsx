'use client';

import { Tab, Tabs } from '@/components/common/tabs';
import { queryApprovedPullRequests, queryMyPullRequests, queryRequestedPullRequests, queryReviewedPullRequests } from '@/queries/github';
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
      queryFn: () => queryMyPullRequests(token!),
      enabled: !!token,
    },
    {
      queryKey: ['pulls', TabKey.REQUESTED_PULL_REQUESTS],
      queryFn: () => queryRequestedPullRequests(token!),
      enabled: !!token,
    },
    {
      queryKey: ['pulls', TabKey.REVIEWED_PULL_REQUESTS],
      queryFn: () => queryReviewedPullRequests(token!, auth?.login),
      enabled: !!token,
    },
    {
      queryKey: ['pulls', TabKey.APPROVED_PULL_REQUESTS],
      queryFn: () => queryApprovedPullRequests(token!, auth?.login),
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
