import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Avatar } from './avatar';
import { useAuthStore } from '../../stores/auth';
import { createLocalStorageSignal } from '../../hooks/create-local-storage-signal';

export const HEADER_HEIGHT = 44;

export function Header() {
  const [isOpen, setIsOpen] = createSignal(false);
  const navigate = useNavigate();
  const [authStore, setAuthStore] = useAuthStore();
  const [, setLocalToken] = createLocalStorageSignal<{github?: string}>('token');

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
      <div class="relative">
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
          <div class="px-4 py-2">
            <p>{authStore()?.login}</p>
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
