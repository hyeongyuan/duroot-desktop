import { createMemo, createResource, createEffect, onCleanup } from 'solid-js';
import type { ResourceFetcher, ResourceSource } from 'solid-js';
import { getCachedValue, getKeyForSource, initializeStoreFieldIfEmpty, store, unifyFetcherForKey } from '../utils/cache';

export interface CachedResourceOptions<T> {
  initialValue?: T;
  refetchOnMount?: boolean;
}

function getDefaultOptions<T>() {
  return {
    refetchOnMount: true,
  };
}

export const createCachedResource = <T, S = any>(
  source: ResourceSource<S>,
  fetcher: ResourceFetcher<S, T>,
  options?: CachedResourceOptions<T>
) => {
  const key = createMemo(() => getKeyForSource(source));
  options = {
    ...getDefaultOptions(),
    ...(options || {}),
  };

  const resource = createResource<T, S>(
    source,
    async (sourceValues, info) => {
      initializeStoreFieldIfEmpty(key());

      return unifyFetcherForKey(
        key(),
        () => fetcher(sourceValues, info),
        !options!.refetchOnMount
      );
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
