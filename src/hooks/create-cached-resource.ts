import { createMemo, createResource, createEffect, onCleanup } from 'solid-js';
import type { ResourceFetcher, ResourceSource } from 'solid-js';
import { getCachedValue, getKeyForSource, initializeStoreFieldIfEmpty, store, unifyFetcherForKey } from '../utils/cache';

export const createCachedResource = <T, S = any>(
  source: ResourceSource<S>,
  fetcher: ResourceFetcher<S, T>,
) => {
  const key = createMemo(() => getKeyForSource(source));

  const resource = createResource<T, S>(
    source,
    async (sourceValues, info) => {
      initializeStoreFieldIfEmpty(key());

      return unifyFetcherForKey(key(), () => fetcher(sourceValues, info));
    },
    { initialValue: getCachedValue(key()) }
  );

  createEffect(() => {
    if (key()) {
      initializeStoreFieldIfEmpty(key());

      store[key()].resourceActions.push(resource[1]);
      const mutatorIndex = store[key()].resourceActions.length - 1;
      onCleanup(() => {
        store[key()]?.resourceActions.splice(mutatorIndex, 1);
      });
    }
  });

  return resource;
};
