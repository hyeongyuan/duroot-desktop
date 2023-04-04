import { createEffect } from 'solid-js';
import { createLocalStorageSignal } from './create-local-storage-signal';
import { fetchUser } from '../utils/github-api';
import { GithubUser } from '../types/github';

type Callback = (data: {user: GithubUser; token: string} | null) => void;

export const createAuthSignal = (callback: Callback) => {
  const [localToken] = createLocalStorageSignal<{github: string}>('token');

  createEffect(() => {
    const token = localToken();
    if (!token) {
      return;
    }
    const githubToken = token.github;

    if (!githubToken) {
      callback(null);
      return;
    }

    fetchUser(githubToken)
      .then(user => {
        callback({ user, token: githubToken });
      });
  });
};
