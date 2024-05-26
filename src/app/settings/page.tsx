
'use client';

import { useRouter } from 'next/navigation';
import { HEADER_HEIGHT } from '@/components/github/header';
import { useAppVersion } from '@/hooks/use-app-version';
import { useAuthStore } from '@/stores/auth';
import { useTokenStore } from '@/stores/token';
import { database } from '@/utils/database';
import { useAutoStart } from '@/hooks/use-auto-start';

export default function Settings() {
  const router = useRouter();
  const version = useAppVersion();
  const { isAutoStart, toggleAutoStart } = useAutoStart();
  const { setData: setToken } = useTokenStore();
  const { setData: setAuthData } = useAuthStore();

  const handleSignOut = async () => {
    await database.updateFieldValue('token.github', null);

    setToken(null);
    setAuthData(null);

    router.push('/auth');
  };

  return (
    <div className="w-full">
      <div
        style={{ height: HEADER_HEIGHT }}
        className="flex items-center bg-[#2d333b] border border-[#373e47] px-4"
      >
        <div
          className="cursor-pointer mr-2"
          onClick={() => router.back()}
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="Vector" d="M23.3467 5.15999L20.9733 2.79999L7.78668 16L20.9867 29.2L23.3467 26.84L12.5067 16L23.3467 5.15999Z" fill="#e6edf3"/>
          </svg>
        </div>
        <h1 className="text-[#e6edf3]">Settings</h1>
      </div>
      <div className="pt-4">
        <section className="px-6 pb-4">
          <div className="m-2">
            <h2 className="text-[11px]">GENERAL</h2>
          </div>
          <div className="flex items-center justify-between bg-[#2d333b] rounded-lg px-4 py-2">
            <span>
              Auto Launch
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={isAutoStart}
                onChange={toggleAutoStart}
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
            </label>
          </div>
        </section>
        <section className="px-6 pb-8">
          <div className="m-2">
            <h2 className="text-[11px]">VERSION</h2>
          </div>
          <div className="bg-[#2d333b] rounded-lg divide-y divide-[#373e47] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2">
              <span>Duroot</span>
              <span className="text-[#768390]">
                v{version}
              </span>
            </div>
            {/* <div class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#373e47]" onClick={handleCheckUpdate}>
              <span>Check for Updates...</span>
            </div> */}
          </div>
        </section>
        <section className="px-6 pb-8">
          <div
            className="flex items-center justify-between bg-[#2d333b] rounded-lg px-4 py-2 cursor-pointer hover:bg-[#373e47] overflow-hidden"
            onClick={handleSignOut}
          >
            <span className="text-[#539BF5]">
              Sign out
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
