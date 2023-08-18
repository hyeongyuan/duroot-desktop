import { Show, For } from 'solid-js';
import { format, formatDistanceToNow } from 'date-fns';
import { MyPullItem } from './my-pull-item';
import { Empty } from './empty';
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
        <Empty />
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
                  labels={item.labels.map(label => ({ name: label.name, color: label.color }))}
                  caption={`${item.draft ? 'Draft • ' : ''}${formatDistanceToNow(new Date(item.created_at))}`}
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
