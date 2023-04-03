import axios from 'axios';
import type { GithubPullRequest, GithubReview, GithubSearch, GithubUser } from '../types/github';

const SELF = '@me';

const instance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
  },
});

export const fetchUser = async (token: string) => {
  const { data } = await instance.get<GithubUser>('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const searchIssues = async (token: string, query: string) => {
  const { data } = await instance.get<GithubSearch>(`/search/issues?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const fetchPullRequestsBy = (token: string, author = SELF) => {
  const query = `type:pr state:open author:${author}`;
  return searchIssues(token, query);
};


export const fetchRequestedPullRequests = async (token: string, login = SELF) => {
  const query = `type:pr state:open user-review-requested:${login}`;
  return searchIssues(token, query);
};

export const fetchReviewCount = async (token: string, pullRequestUrl: string) => {
  const [pullRequest, reviews] = await Promise.all([
    fetchPullRequest(token, pullRequestUrl),
    fetchPullRequestReviews(token, pullRequestUrl),
  ]);
  const reviewMap = new Map(reviews.map(review => [review.user.login, review.state]));

  return {
    approved: [...reviewMap.values()].filter(state => state === 'APPROVED').length,
    total: reviewMap.size + pullRequest.requested_reviewers.length,
  };
};

const fetchPullRequest = async (token: string, pullRequestUrl: string) => {
  const { data } = await instance.get<GithubPullRequest>(pullRequestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const fetchPullRequestReviews = async (token: string, pullRequestUrl: string) => {
  const { data } = await instance.get<GithubReview[]>(`${pullRequestUrl}/reviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
