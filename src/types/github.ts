export interface GithubUser {
  id: number;
  login: string;
}

interface GithubLabel {
  id: number;
  name: string;
  color: string;
}

export interface GithubIssueItem {
  id: number;
  number: number;
  title: string;
  html_url: string;
  repository_url: string;
  pull_request: {url: string};
  created_at: string;
  labels: GithubLabel[];
  user: GithubUser;
  draft: boolean;
}

export interface GithubSearch {
  total_count: number;
  items: GithubIssueItem[];
}

export type GitHubReviewState = 'PENDING' | 'APPROVED' | 'COMMENTED';
export interface GithubReview {
  state: GitHubReviewState;
  user: GithubUser;
}

export interface GithubPull {
  url: string;
  requested_reviewers: GithubUser[];
  user: GithubUser;
}
