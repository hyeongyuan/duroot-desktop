import { Accessor, Setter, createEffect, createSignal } from 'solid-js';
import { getAllDatabase, updateDatabase } from '../utils/database';

export const createLocalStorageSignal = <T extends object>(key: string): [Accessor<T | undefined>, Setter<T>] => {
  const [value, setValue] = createSignal<T>();

  createEffect(() => {
    getAllDatabase()
      .then((data) => {
        let pointer = data || {} as any;

        const keys = key.split('.');
        for (let i = 0; i < keys.length; i++) {
          const currentKey = keys[i];
          if (i === keys.length - 1) {
            setValue(pointer[currentKey] || {});
          } else {
            pointer = pointer[currentKey] || {};
          }
        }
      });
  });

  const handleSetValue = async (newValue: T | ((v: T | undefined) => T)): Promise<T> => {
    const _val: T = typeof newValue === 'function' ? newValue(value()) : newValue;

    setValue(_val as any);
    await updateDatabase(key, _val);

    return _val;
  };

  return [value as Accessor<T | undefined>, handleSetValue as Setter<T>];
};
