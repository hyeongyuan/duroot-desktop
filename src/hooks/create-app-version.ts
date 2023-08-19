import { createSignal, onMount } from 'solid-js';
import { getVersion } from '@tauri-apps/api/app';

export const createAppVersion = () => {
  const [version, setVersion] = createSignal('');

  onMount(async () => {
    setVersion(await getVersion());
  });
  
  return version;
};
