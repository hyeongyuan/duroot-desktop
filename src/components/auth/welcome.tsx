import { Show, createEffect, createSignal, onMount } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { Avatar } from '../common/avatar';

const FINAL_STEP = 3;

interface WelcomeProps {
  imageUrl: string;
  name: string;
  onEnd: () => void;
}

export function Welcome(props: WelcomeProps) {
  const [step, setStep] = createSignal(0);

  onMount(() => {
    setStep(step => step + 1);
  });

  createEffect(() => {
    if (step() === FINAL_STEP + 1) {
      props.onEnd();
    }
  });

  const handleEnterTransition = (el: Element, done: () => void) => {
    const a = el.animate([{ opacity: 0, easing: 'ease-in-out' }, { opacity: 1 }], {
      duration: 800
    });
    a.finished.then(() => {
      done();
      setStep(step => step + 1);
    });
  };

  return (
    <div class="my-28">
      <div class="flex mb-20 justify-center">
        <Transition onEnter={handleEnterTransition}>
          <Show when={step() > 0}>
            <Avatar size={96} imageUrl={props.imageUrl} />
          </Show>
        </Transition>
      </div>
      <div class="text-center whitespace-pre-wrap">
        <Transition onEnter={handleEnterTransition}>
          <Show when={step() > 1}>
            <span class="text-[28px] font-semibold italic">
              {'Welcome to Duroot\n'}
            </span>
          </Show>
        </Transition>
        <Transition onEnter={handleEnterTransition}>
          <Show when={step() > 2}>
            <span class="underline italic">{props.name}</span> 
          </Show>
        </Transition>
      </div>
    </div>
  );
}
