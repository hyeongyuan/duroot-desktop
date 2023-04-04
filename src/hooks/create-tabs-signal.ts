import { createEffect, createSignal } from 'solid-js';
import { useLocation } from '@solidjs/router';

export enum TabKey {
  MY_PULL_REQUESTS = 'myPullRequests',
  REQUESTED_PULL_REQUESTS = 'requestedPullRequests',
}

export interface Tab {
  name: string;
  key: TabKey;
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
        name: '내가 만든 PR',
        key: TabKey.MY_PULL_REQUESTS,
      },
      {
        name: '내 리뷰를 기다리는 PR',
        key: TabKey.REQUESTED_PULL_REQUESTS,
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
