'use client';

import { Tab, Tabs } from '@/components/common/tabs';
import { useSearchParams } from 'next/navigation';

export enum TabKey {
  MY_PULL_REQUESTS = 'myPullRequests',
  REQUESTED_PULL_REQUESTS = 'requestedPullRequests',
  REVIEWED_PULL_REQUESTS = 'reviewedPullRequests',
  APPROVED_PULL_REQUESTS = 'approvedPullRequests',
}

const TABS: Tab[] =  [
  {
    key: TabKey.MY_PULL_REQUESTS,
    name: 'My',
    href: `/pulls?tab=${TabKey.MY_PULL_REQUESTS}`,
  },
  {
    key: TabKey.REQUESTED_PULL_REQUESTS,
    name: 'Requested',
    href: `/pulls?tab=${TabKey.REQUESTED_PULL_REQUESTS}`,
  },
  {
    key: TabKey.REVIEWED_PULL_REQUESTS,
    name: 'Reviewed',
    href: `/pulls?tab=${TabKey.REVIEWED_PULL_REQUESTS}`,
  },
  {
    key: TabKey.APPROVED_PULL_REQUESTS,
    name: 'Approved',
    href: `/pulls?tab=${TabKey.APPROVED_PULL_REQUESTS}`,
  }
];

export function PullsTabs() {
  const searchParams = useSearchParams();
  const tabQuery = (searchParams.get('tab') || TabKey.MY_PULL_REQUESTS)as TabKey;

  return (
    <Tabs data={TABS} activeTab={tabQuery} />
  );
}
