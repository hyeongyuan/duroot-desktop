import { Show } from 'solid-js';
import { ApprovedLabel } from './approved-label';

interface PullProps {
  title: string;
  subtitle: string;
  timestamp: string;
  approved: boolean;
}

export function PullItem (props: PullProps) {
  return (
    <li class="flex px-4 py-2 cursor-pointer hover:bg-[#2d333b]">
      <div class="grow-[95]">
        <div class="flex align-center font-normal pr-1 text-gray-500 text-sm leading-5 line-clamp-1 break-all">
          <p class="flex align-center font-normal pr-1 text-[#768390] text-sm leading-5 line-clamp-1 break-all">
            {props.subtitle}
          </p>
          <Show when={props.approved}>
            <ApprovedLabel />
          </Show>
        </div>
        <h1 class="flex align-center font-medium text-base leading-6 line-clamp-3 my-1">
          {props.title}
        </h1>
      </div>
      <div class="grow-[5] font-normal text-[#768390] text-sm leading-5">
        {props.timestamp}
      </div>
    </li>
  );
}
