import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { disable, enable, isEnabled } from 'tauri-plugin-autostart-api';
import { useAuthStore } from '../stores/auth';
import { createLocalStorageSignal } from '../hooks/create-local-storage-signal';
import { createAppVersion } from '../hooks/create-app-version';

export const HEADER_HEIGHT = 44;

function Settings() {
  const [isAutoStart, setIsAutoStart] = createSignal(false);
  const navigate = useNavigate();
  const [, setAuthStore] = useAuthStore();
  const [, setLocalToken] = createLocalStorageSignal<{github?: string}>('token');
  const version = createAppVersion();

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

  // const handleCheckUpdate = async () => {
  //   // TODO: 버전 확인 및 업데이트 알림
  // };

  const handleSignOut = async (event: MouseEvent) => {
    event.preventDefault();

    await setLocalToken({});
    setAuthStore(null);

    navigate('/auth');
  };

  return (
    <div class="w-full">
      <div
        style={{ height: `${HEADER_HEIGHT}px` }}
        class="flex items-center bg-[#2d333b] border border-[#373e47] px-4"
      >
        <div
          class="cursor-pointer mr-2"
          onClick={() => window.history.back()}
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="Vector" d="M23.3467 5.15999L20.9733 2.79999L7.78668 16L20.9867 29.2L23.3467 26.84L12.5067 16L23.3467 5.15999Z" fill="#e6edf3"/>
          </svg>
        </div>
        <h1 class="text-[#e6edf3]">Settings</h1>
      </div>
      <div class="pt-4">
      <section class="px-6 pb-4">
        <div class="m-2">
          <h2 class="text-[11px]">GENERAL</h2>
        </div>
        <div class="flex items-center justify-between bg-[#2d333b] rounded-lg px-4 py-2">
          <span>
            Auto Launch
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              class="sr-only peer"
              type="checkbox"
              checked={isAutoStart()}
              onChange={handleAutoStart}
            />
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
          </label>
        </div>
      </section>
      <section class="px-6 pb-8">
        <div class="m-2">
          <h2 class="text-[11px]">VERSION</h2>
        </div>
        <div class="bg-[#2d333b] rounded-lg divide-y divide-[#373e47] overflow-hidden">
          <div class="flex items-center justify-between px-4 py-2">
            <span>Duroot</span>
            <span class="text-[#768390]">
              v{version()}
            </span>
          </div>
          {/* <div class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#373e47]" onClick={handleCheckUpdate}>
            <span>Check for Updates...</span>
          </div> */}
        </div>
      </section>
      <section class="px-6 pb-8">
        <div
          class="flex items-center justify-between bg-[#2d333b] rounded-lg px-4 py-2 cursor-pointer hover:bg-[#373e47] overflow-hidden"
          onClick={handleSignOut}
        >
          <span class="text-[#539BF5]">
            Sign out
          </span>
        </div>
      </section>
      </div>
    </div>
  );
}

export default Settings;
