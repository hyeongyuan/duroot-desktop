import { For, Show } from 'solid-js';
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
      class="bg-[#2d333b] px-2 border border-[#373e47] overflow-y-auto whitespace-nowrap"
    >
      <For each={props.tabs}>
        {tab => (
          <li class={`py-2 ${props.activeTab === tab.key ? 'border-[#ec775c]' : 'border-[transparent]'} border-b-2 inline-block`}>
            <A
              href={`/main?tab=${tab.key}`}
              class={`p-2 text-xs cursor-pointer ${props.activeTab === tab.key ? 'text-[#e6edf3]': ''} hover:text-[#e6edf3]`}
            >
              {tab.name}
              <Show when={!!tab.count}>
                <span class="ml-2 px-1 bg-[rgba(99,110,123,0.4)] rounded-full">
                  {tab.count}
                </span>
              </Show>
            </A>
          </li>
        )}
      </For>
    </ul>
  );
}
