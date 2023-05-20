import { Show, For } from 'solid-js';
import { format, formatDistanceToNow } from 'date-fns';
import { MyPullItem } from './my-pull-item';
import type { GithubSearch } from '../../types/github';

interface MyPullListProps {
  data: GithubSearch;
  dataUpdatedAt: Date;
}

export function MyPullList(props: MyPullListProps) {
  return (
    <>
      <div class="py-2">
        <p class="text-[#768390] text-[10px] text-center">
          {`Last Update ${format(props.dataUpdatedAt, 'HH\'h\' mm\'m\' ss\'s\'')}`}
        </p>
      </div>
      <Show when={props.data.items.length === 0}>
        <div class="p-24">
          <p class="text-[#768390] text-sm text-center">
            {'데이터가 없습니다.'}
          </p>
        </div>
      </Show>
      <Show when={props.data.items.length !== 0}>
        <ul class="divide-y divide-[#373e47]">
          <For each={props.data.items}>
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
    </>
  );
}
