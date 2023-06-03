import { ResourceSource, ResourceActions } from 'solid-js/types/reactive/signal';

type Resolve<T> = (value: T) => void;
type Reject = (reason?: any) => void;

interface StoreField<T = any> {
  cachedValue?: T;
  isFetching: boolean;
  awaiters: { resolve: Resolve<T>; reject: Reject }[];
  resourceActions: ResourceActions<T>[];
}

interface Store {
  [key: string]: StoreField;
}

export const store: Store = {};

export function initializeStoreFieldIfEmpty(key: string) {
  if (!store[key]) {
    store[key] = {
      isFetching: false,
      awaiters: [],
      resourceActions: [],
    };
  }
}

export function getCachedValue(key: string) {
  return store[key]?.cachedValue;
}

export function setCachedValue<T>(key: string, value: T) {
  initializeStoreFieldIfEmpty(key);
  store[key].cachedValue = value;
}

export function getKeyForSource<S>(source: ResourceSource<S>): string {
  const value = typeof source === 'function' ? (source as Function)() : source;
  const key: string = isPlainObject(value) ? stringyValue(value) : value + '';
  return key;
}

export async function unifyFetcherForKey<T = any>(
  key: string,
  fetcher: () => Promise<T> | T
): Promise<T> {
  const cachedValue = getCachedValue(key);
  if (cachedValue) {
    return cachedValue;
  }
  if (store[key].isFetching) {
    let resolve: Resolve<T>, reject: Reject;
    const awaiterPromise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
      store[key].awaiters.push({ resolve, reject });
    });
    return awaiterPromise as Promise<T>;
  }
  store[key].isFetching = true;
  try {
    const value = await fetcher();
    setCachedValue(key, value);
    for (let { resolve } of store[key].awaiters) {
      resolve(value);
    }
    return value;
  } catch (e) {
    for (let { reject } of store[key].awaiters) {
      reject(e);
    }
    return undefined as any;
  } finally {
    store[key].isFetching = false;
    store[key].awaiters = [];
  }
}

// utils
function hasObjectPrototype(o: any): boolean {
  return Object.prototype.toString.call(o) === '[object Object]';
}

// Copied from: https://github.com/jonschlinkert/is-plain-object
export function isPlainObject(o: any): o is Object {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === 'undefined') {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  // eslint-disable-next-line no-prototype-builtins
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

export function stringyValue(value: any) {
  return JSON.stringify(value, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {} as any)
      : val
  );
}