import { Show } from 'solid-js';
import { ApprovedLabel } from './approved-label';

interface PullProps {
  id: number;
  title: string;
  subtitle: string;
  timestamp: string;
  approved: boolean;
  onClick?: (id: PullProps['id']) => void;
}

export function PullItem (props: PullProps) {
  return (
    <li
      class="flex flex-col px-4 py-2 cursor-pointer hover:bg-[#2d333b]"
      onClick={() => props.onClick?.(props.id)}
    >
      <div class="flex items-center">
        <p class="pr-1 text-[#768390] text-xs leading-5 line-clamp-1 break-all">
          {props.subtitle + 'hello'}
        </p>
        <Show when={props.approved}>
          <ApprovedLabel />
        </Show>
      </div>
      <h1 class="font-medium text-sm leading-6 line-clamp-3 break-all my-1">
        {props.title}
      </h1>
      <p class="text-[#768390] text-xs leading-5 line-clamp-1 break-all">
        {props.timestamp}
      </p>
    </li>
  );
}
