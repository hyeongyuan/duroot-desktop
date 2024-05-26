import { useEffect, useState } from 'react';
import { disable, enable, isEnabled } from 'tauri-plugin-autostart-api';

export const useAutoStart = () => {
  const [isAutoStart, setIsAutoStart] = useState(false);

  useEffect(() => {
    isEnabled().then(setIsAutoStart);
  }, []);

  const toggleAutoStart = async () => {
    const isAutoStart = await isEnabled();
    if (isAutoStart) {
      await disable();
    } else {
      await enable();
    }
    setIsAutoStart(await isEnabled());
  };

  return { isAutoStart, toggleAutoStart };
};
