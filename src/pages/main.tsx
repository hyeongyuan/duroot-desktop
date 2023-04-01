import { createSignal, For } from "solid-js";
import Pull from "../components/github/Pull";
import Spinner from "../components/Spinner";

interface IPull {
  id: number;
  title: string;
  repo: string;
  owner: string;
  reviewers: string[];
  user: string;
}

const mockPulls: IPull[] = [
  {
    id: 1,
    title: '테스트 PR 1',
    repo: 'repo',
    owner: 'owner',
    reviewers: [],
    user: 'connor',
  },
  {
    id: 2,
    title: '테스트 PR 2',
    repo: 'repo',
    owner: 'owner',
    reviewers: [],
    user: 'connor',
  }
];

function Main() {
  const [pulls] = createSignal<IPull[]>(mockPulls);
  return (
    <div class="w-full">
      <ul class="divide-y divide-[#373e47]">
        <For each={pulls()} fallback={<Spinner />}>
          {item => (
            <Pull title={item.title} repo={item.repo} owner={item.owner} user={item.user} />
          )}
        </For>
      </ul>
    </div>
  );
}

export default Main;
