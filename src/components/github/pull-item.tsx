import { For, Show } from 'solid-js';

interface PullProps {
  title: string;
  titleUrl: string;
  subtitle: string;
  subtitleUrl: string;
  labels: {
    name: string;
    color: string;
  }[];
  caption?: string;
}

export function PullItem (props: PullProps) {
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
