import { For } from 'solid-js';
import { A } from '@solidjs/router';
import type { Tab, TabKey } from '../../hooks/create-tabs-signal';

const HEADER_HEIGHT = 44;

interface HeaderProps {
  tabs: Tab[];
  activeTab: TabKey;
}

export function Header(props: HeaderProps) {
  return (
    <ul
      style={{ height: `${HEADER_HEIGHT}px` }}
      class="flex gap-2 items-center bg-[#2d333b] px-2 border border-[#373e47]"
    >
      <For each={props.tabs}>
        {tab => (
          <li class={`py-2 ${props.activeTab === tab.key ? 'border-[#ec775c]' : 'border-[transparent]'} border-b-2`}>
            <A
              href={`/main?tab=${tab.key}`}
              class={`p-2 text-xs cursor-pointer ${props.activeTab === tab.key ? 'text-[#e6edf3]': ''} hover:text-[#e6edf3]`}
            >
              {tab.name}
            </A>
          </li>
        )}
      </For>
    </ul>
  );
}
