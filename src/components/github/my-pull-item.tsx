import { For, Show, createEffect } from 'solid-js';
import { ApprovedLabel } from './approved-label';
import { useAuthStore } from '../../stores/auth';
import { fetchReviewCount } from '../../utils/github-api';
import { TabKey, createTabsSignal } from '../../hooks/create-tabs-signal';
import { createCachedResource } from '../../hooks/create-cached-resource';

interface MyPullProps {
  id: number;
  subtitle: string;
  subtitleUrl: string;
  title: string;
  titleUrl: string;
  caption?: string;
  labels: {
    name: string;
    color: string;
  }[];
  pullRequestUrl: string;
}

export function MyPullItem (props: MyPullProps) {
  const [authStore] = useAuthStore();
  const tabState = createTabsSignal();

  const [reviewCount, { refetch: reviewCountRefetch }] = createCachedResource(() => ['my-pulls', props.id], async () => {
    const { token, login } = authStore() || {};
    if (!token || !login) {
      return;
    }
    const data = await fetchReviewCount(token, props.pullRequestUrl, login);
    return data;
  });

  createEffect(() => {
    if (tabState().activeTab === TabKey.MY_PULL_REQUESTS) {
      reviewCountRefetch();
    }
  });

  return (
    <li class="flex flex-col px-4 py-2">
      <div class="flex items-center">
        <a
          class="text-[#768390] text-xs leading-5 line-clamp-1 break-all hover:underline hover:underline-offset-1 pr-1"
          href={props.subtitleUrl}
          target="_blank"
        >
          {props.subtitle}
        </a>
        <Show when={!!reviewCount()?.total &&  reviewCount()!.approved === reviewCount()!.total}>
          <ApprovedLabel />
        </Show>
      </div>
      <a
        class="font-medium text-sm hover:text-[#539bf5] leading-6 line-clamp-3 break-all my-1"
        href={props.titleUrl}
        target="_blank"
      >
        {props.title}
      </a>
      <span class="flex flex-wrap space-x-1 gap-1"> 
        <For each={props.labels}>
          {item => {
            return (
              <a
                class="text-xs leading-[18px] rounded-full px-[7px] border border-transparent"
                style={{
                  'background-color': `#${item.color}2e`,
                  'border-color': `#${item.color}4d`,
                  'color': `#${item.color}`,
                }}
              >
                {item.name}
              </a>
            );
          }}
        </For>
      </span>
      <Show when={!!props.caption}>
        <p class="text-[#768390] text-[10px] leading-5 line-clamp-1 break-all mt-1">
          {props.caption}
        </p>
      </Show>
    </li>
  );
}
