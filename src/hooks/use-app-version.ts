import { useEffect, useState } from 'react';
import { getVersion } from '@tauri-apps/api/app';

export const useAppVersion = () => {
  const [version, setVersion] = useState<string>();

  useEffect(() => {
    getVersion().then(setVersion);
  }, []);

  return version;
};
