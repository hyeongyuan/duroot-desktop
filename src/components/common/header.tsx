import { createSignal, onCleanup, onMount } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import { exit } from '@tauri-apps/api/process';
import { Avatar } from './avatar';
import { useAuthStore } from '../../stores/auth';

export const HEADER_HEIGHT = 44;

export function Header() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = createSignal(false);
  const [authStore] = useAuthStore();

  let element: HTMLDivElement;
  onMount(() => {
    const mousedownEventListener = (event: MouseEvent) => {
      if (!element || element.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', mousedownEventListener);
    onCleanup(() => {
      document.removeEventListener('mousedown', mousedownEventListener);
    });
  });

  onMount(() => {
    const blurEventListener = () => {
      setIsOpen(false);
    };
    window.addEventListener('blur', blurEventListener);
    onCleanup(() => {
      document.removeEventListener('mousedown', blurEventListener);
    });
  });

  return (
    <div
      style={{
        height: `${HEADER_HEIGHT}px`,
      }}
      class="flex items-center justify-between bg-[#2d333b] border border-[#373e47] px-4"
    >
      <div class="flex gap-4">
        <A href="/pulls">
          <h1 class={`${pathname === '/pulls' ? 'text-[#e6edf3]' : ''}`}>Pulls</h1>
        </A>
      </div>
      <div class="relative select-none" ref={element!}>
        <div class="cursor-pointer" onClick={() => setIsOpen(prev => !prev)}>
          <Avatar
            size={24}
            imageUrl={authStore() ? `https://avatars.githubusercontent.com/u/${authStore()?.id!}?s=40&v=4` : ''}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '-6px',
            'box-shadow': '0 8px 24px #1c2128'
          }}
          class={`${isOpen() ? '' : 'hidden'} z-10 bg-[#2d333b] border border-[#444c56] rounded-lg w-36 py-[4px] text-sm text-[#adbac7]`}
        >
          <div class="px-4 py-2 cursor-default">
            <p>{authStore()?.login}</p>
          </div>

          <div class="border-t border-[#444c56] my-[6px]" />

          <A href="/settings" class="flex items-center px-2 py-1 mx-2 hover:bg-[#444c56] rounded">
            <span class="mr-2">
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" fill="#768390">
                <path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z" />
              </svg>
            </span>
            <span>
              Settings
            </span>
          </A>

          <div class="border-t border-[#444c56] my-[6px]" />

          <a
            href="#"
            class="block px-2 py-1 mx-2 hover:bg-[#444c56] rounded"
            onClick={() => exit(1)}
          >
            Quit
          </a>
        </div>
      </div>
    </div>
  );
}
