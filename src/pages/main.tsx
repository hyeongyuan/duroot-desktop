import { createEffect, createSignal, For } from "solid-js";
import { formatDistanceToNow } from "date-fns";
import { PullItem } from "../components/github/pull-item";
import Spinner from "../components/Spinner";
import { fetchPulls, IPull } from "../utils/github-api";

function Main() {
  const [pulls, setPulls] = createSignal<IPull[]>();

  createEffect(() => {
    fetchPulls({owner: 'hyeongyuan', repo: 'chat-gpt-review'})
      .then(data => {
        setPulls(data);
      });
  });
  
  return (
    <div class="w-full ov">
      <ul class="divide-y divide-[#373e47]">
        <For each={pulls()} fallback={<Spinner />}>
          {item => (
            <PullItem
              title={item.title}
              subtitle={`${item.owner} / ${item.repo}`}
              timestamp={formatDistanceToNow(new Date(item.createdAt))}
              approved={item.approved}
            />
          )}
        </For>
      </ul>
    </div>
  );
}

export default Main;
