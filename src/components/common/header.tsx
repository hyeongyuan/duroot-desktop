import { createSignal, onCleanup, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { enable, isEnabled, disable } from 'tauri-plugin-autostart-api';
import { Avatar } from './avatar';
import { useAuthStore } from '../../stores/auth';
import { createLocalStorageSignal } from '../../hooks/create-local-storage-signal';

export const HEADER_HEIGHT = 44;

export function Header() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isAutoStart, setIsAutoStart] = createSignal(false);
  const navigate = useNavigate();
  const [authStore, setAuthStore] = useAuthStore();
  const [, setLocalToken] = createLocalStorageSignal<{github?: string}>('token');

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

  onMount(async () => {
    setIsAutoStart(await isEnabled());
  });

  const handleAutoStart = async () => {
    const isAutoStart = await isEnabled();
    if (isAutoStart) {
      await disable();
    } else {
      await enable();
    }
    setIsAutoStart(await isEnabled());
  };

  const handleSignOut = async (event: MouseEvent) => {
    event.preventDefault();

    await setLocalToken({});
    setAuthStore(null);

    navigate('/auth');
  };
  return (
    <div
      style={{
        height: `${HEADER_HEIGHT}px`,
      }}
      class="flex items-center justify-end bg-[#2d333b] border border-[#373e47] px-4"
    >
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

          <div class="flex items-center px-4 py-1 hover:bg-[#316dca] cursor-pointer" onClick={handleAutoStart}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isAutoStart() ? '#10B981' : '#444c56'}>
              <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z"/>
            </svg>
            <p class="ml-1">Auto launch</p>
          </div>

          <div class="border-t border-[#444c56] my-[6px]" />

          <a
            href="#"
            class="block px-4 py-1 hover:bg-[#316dca]"
            onClick={handleSignOut}
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}
