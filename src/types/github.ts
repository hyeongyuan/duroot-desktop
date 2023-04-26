export type GitHubReviewState = 'PENDING' | 'APPROVED' | 'COMMENTED';

interface GithubLabel {
  id: number;
  name: string;
  color: string;
}

export interface GithubUser {
  login: string;
}

export interface GithubReview {
  state: GitHubReviewState;
  user: GithubUser;
}

export interface GithubPullRequest {
  url: string;
  requested_reviewers: GithubUser[];
  user: GithubUser;
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
}

export interface GithubSearch {
  total_count: number;
  items: GithubIssueItem[];
}
