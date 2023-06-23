import { createEffect, createSignal } from 'solid-js';
import { useLocation } from '@solidjs/router';

export enum TabKey {
  MY_PULL_REQUESTS = 'myPullRequests',
  REQUESTED_PULL_REQUESTS = 'requestedPullRequests',
  REVIEWED_PULL_REQUESTS = 'reviewedPullRequests',
  APPROVED_PULL_REQUESTS = 'approvedPullRequests',
}

export interface Tab {
  name: string;
  key: TabKey;
  count?: number;
}

interface TabState {
  tabs: {
    name: string;
    key: TabKey;
  }[];
  activeTab: TabKey;
}

export const createTabsSignal = () => {
  const { query } = useLocation();
  const [state, setState] = createSignal<TabState>({
    tabs: [
      {
        name: 'My',
        key: TabKey.MY_PULL_REQUESTS,
      },
      {
        name: 'Requested',
        key: TabKey.REQUESTED_PULL_REQUESTS,
      },
      {
        name: 'Reviewed',
        key: TabKey.REVIEWED_PULL_REQUESTS,
      },
      {
        name: 'Approved',
        key: TabKey.APPROVED_PULL_REQUESTS,
      }
    ],
    activeTab: TabKey.MY_PULL_REQUESTS,
  });

  createEffect(() => {
    if (!query.tab) {
      return;
    }
    setState(prevState => ({
      ...prevState,
      activeTab: query.tab as TabKey,
    }));
  });

  return state;
};
