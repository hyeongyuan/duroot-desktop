import { For, Show } from 'solid-js';
import { A } from '@solidjs/router';
import type { Tab, TabKey } from '../../hooks/create-tabs-signal';

export const TAB_LIST_HEIGHT = 44;

interface HeaderProps {
  tabs: Tab[];
  activeTab: TabKey;
}

export function TabList(props: HeaderProps) {
  return (
    <ul
      style={{
        height: `${TAB_LIST_HEIGHT}px`,
        'box-shadow': 'inset 0 -1px 0 #373e47'
      }}
      class="px-2 overflow-y-auto whitespace-nowrap"
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
