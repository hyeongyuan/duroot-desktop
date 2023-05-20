import { Show, For } from 'solid-js';
import { format, formatDistanceToNow } from 'date-fns';
import { PullItem } from './pull-item';
import type { GithubIssueItem, GithubSearch } from '../../types/github';

interface PullListProps {
  data: GithubSearch | GithubIssueItem[];
  dataUpdatedAt: Date;
}

export function PullList(props: PullListProps) {
  return (
    <>
      <div class="py-2">
        <p class="text-[#768390] text-[10px] text-center">
          {`Last Update ${format(props.dataUpdatedAt || new Date(), 'HH\'h\' mm\'m\' ss\'s\'')}`}
        </p>
      </div>
      <Show when={Array.isArray(props.data) ? props.data.length === 0 : props.data.items.length === 0}>
        <div class="p-24">
          <p class="text-[#768390] text-sm text-center">
            {'데이터가 없습니다.'}
          </p>
        </div>
      </Show>
      <Show when={Array.isArray(props.data) ? props.data.length !== 0 : props.data.items.length !== 0}>
        <ul class="divide-y divide-[#373e47]">
          <For each={Array.isArray(props.data) ? props.data : props.data.items}>
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
    </>
  );
}
