import { fetchReviewCount } from '../utils/github-api';
import type { GithubIssueItem } from '../types/github';

export class PullRequestListViewItem {
  id: number;
  number: number;
  title: string;
  htmlUrl: string;
  repositoryUrl: string;
  pullRequestUrl: string;
  createdAt: Date;
  login: string;
  approvedCount?: number;
  reviewerCount?: number;

  constructor (issueItem: GithubIssueItem) {
    this.id = issueItem.id;
    this.number = issueItem.number;
    this.title = issueItem.title;
    this.htmlUrl = issueItem.html_url;
    this.repositoryUrl = issueItem.repository_url;
    this.pullRequestUrl = issueItem.pull_request.url;
    this.createdAt = new Date(issueItem.created_at);
    this.login = issueItem.user.login;
  }

  get organization () {
    const [repo, org] = this.repositoryUrl.split('/').reverse();
    return `${org}/${repo}`;
  }

  async loadReviewerCount (token: string) {
    const fetchResult = await fetchReviewCount(token, this.pullRequestUrl);

    this.reviewerCount = fetchResult.total;
    this.approvedCount = fetchResult.approved;
  }
}
