import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
  },
});

interface IFetchPulls {
  owner: string;
  repo: string;
}

export interface IPull {
  id: number;
  title: string;
  repo: string;
  owner: string;
  reviewers: string[];
  user: string;
  url: string;
  approved: boolean;
  createdAt: string;
}

export const fetchPulls = async ({owner, repo}: IFetchPulls, token?: string) => {
  const {data: pulls} = await instance.get<any[]>(`/repos/${owner}/${repo}/pulls`, {
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
