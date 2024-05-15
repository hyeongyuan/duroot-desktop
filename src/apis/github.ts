import axios from 'axios';
import { GithubUser } from '@/types/github';

const instance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
  },
});

export const fetchUser = async (token: string) => {
  const { data } = await instance.get<GithubUser>('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
