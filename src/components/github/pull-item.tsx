import { For } from 'solid-js';
import { formatDistanceToNow } from 'date-fns';

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
  user: {
    id: number;
    login: string;
  };
  createdAt: string;
}

const getProfileUrl = (userId: number, size = 40) => `https://avatars.githubusercontent.com/u/${userId}?s=${size}&v=4`;

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
      <div class="flex items-center text-[#768390]">
        <span class="flex items-center">
          <img class="w-4 h-4 rounded-full mr-2" src={getProfileUrl(props.user.id, 32)} alt="avatar" />
          <p class="text-[#adbac7] text-[10px] font-medium leading-5 line-clamp-1 break-all">
            {props.user.login}
          </p>
        </span>
        <span class="mx-1">·</span>
        <span>
          <p class="text-[10px] font-medium leading-5 line-clamp-1 break-all">
            {formatDistanceToNow(new Date(props.createdAt))}
          </p>
        </span>
      </div>
    </li>
  );
}
