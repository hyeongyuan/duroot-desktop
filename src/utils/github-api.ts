import axios from 'axios';
import type { IPull, ISearch } from '../types/github';

const SELF = '@me';

const instance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
  },
});

const searchIssues = async (token: string, query: string) => {
  const { data } = await instance.get<ISearch>(`/search/issues?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  data.items.map(async item => {
    console.log(item);
  });
};

export const fetchPullsBy = (token: string, author = SELF) => {
  const query = `type:pr state:open author:${author}`;
  return searchIssues(token, query);
};


interface IFetchPulls {
  owner: string;
  repo: string;
}

export const fetchPulls = async ({owner, repo}: IFetchPulls, token?: string) => {
  const { data: pulls } = await instance.get<any[]>(`/repos/${owner}/${repo}/pulls`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return pulls.map(pull => ({
    id: pull.number,
    title: pull.title,
    repo,
    owner,
    user: pull.user.login,
    url: pull.html_url,
    approved: true,
    createdAt: pull.created_at,
  } as IPull));
};

export const fetchPullReviews = async (token: string, pullUrl: string) => {

};

interface IUser {
  id: number;
  username: string;
  displayName: string;
}

export const fetchUser = async (token: string) => {
  const { data: user } = await instance.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    id: user.id,
    username: user.login,
    displayName: user.name,
  } as IUser;
};
