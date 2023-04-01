import { Show } from 'solid-js';
import { ApprovedLabel } from './approved-label';

interface PullProps {
  title: string;
  subtitle: string;
  timestamp: string;
  approved: boolean;
  titleUrl: string;
  subtitleUrl: string;
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
        <Show when={props.approved}>
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
      <p class="text-[#768390] text-xs leading-5 line-clamp-1 break-all">
        {props.timestamp}
      </p>
    </li>
  );
}
