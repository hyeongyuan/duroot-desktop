import { createEffect, createSignal, For } from "solid-js";
import Pull from "../components/github/Pull";
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
            <Pull title={item.title} repo={item.repo} owner={item.owner} user={item.user} createdAt={item.createdAt} />
          )}
        </For>
      </ul>
    </div>
  );
}

export default Main;
