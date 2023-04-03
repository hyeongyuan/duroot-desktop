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

export interface IIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  repository_url: string;
  pull_request: {url: string};
  user: {
    id: number;
    login: string;
  };
  created_at: string;
}

export interface ISearch {
  total_count: number;
  items: IIssue[];
}
