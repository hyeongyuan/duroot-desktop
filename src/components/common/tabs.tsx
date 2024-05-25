import Link from 'next/link';

export const TABS_HEIGHT = 44;

export interface Tab {
  key: string;
  name: string;
  href: string;
  count?: number;
}

interface TabsProps {
  data: Tab[];
  activeTab: Tab['key'];
  shallowRouting?: boolean;
}

export function Tabs({ data, activeTab, shallowRouting }: TabsProps) {
  return (
    <ul
      style={{
        height: `${TABS_HEIGHT}px`,
        boxShadow: 'inset 0 -1px 0 #373e47'
      }}
      className="px-2 overflow-y-auto whitespace-nowrap"
    >
      {data.map(({ key, name, href, count }) => (
        <li key ={key} className={`py-2 ${activeTab === key ? 'border-[#ec775c]' : 'border-[transparent]'} border-b-2 inline-block`}>
          <Link
            href={href}
            className={`p-2 text-xs cursor-pointer ${activeTab === key ? 'text-[#e6edf3]': ''} hover:text-[#e6edf3]`}
            shallow={shallowRouting}
          >
            {name}
            {!!count && (
              <span className="ml-2 px-1 bg-[rgba(99,110,123,0.4)] rounded-full">
                {count}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
