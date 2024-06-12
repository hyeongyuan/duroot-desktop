'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns/format';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { TABS_HEIGHT } from '@/components/common/tabs';
import { HEADER_HEIGHT } from '@/components/github/header';
import { TabKey } from '@/components/github/pulls-tabs';
import { PullsItem } from '@/components/github/pulls-item';
import { MyPullsItem } from '@/components/github/my-pulls-item';
import { Empty } from '@/components/github/empty';
import { Spinner } from '@/components/common/spinner';
import { useTokenStore } from '@/stores/token';
import { useAuthStore } from '@/stores/auth';
import { queryApprovedPullRequests, queryMyPullRequests, queryRequestedPullRequests, queryReviewedPullRequests } from '@/queries/github';

const WINDOW_HEIGHT = 500;
const HEADER_SECTION_HEIGHT = HEADER_HEIGHT + TABS_HEIGHT;

export function PullsList() {
  const searchParams = useSearchParams();
  const tabQuery = (searchParams.get('tab') || TabKey.MY_PULL_REQUESTS)as TabKey;
  const { data: token } = useTokenStore();
  const { data: auth } = useAuthStore();

  const { data: pulls, isLoading, isRefetching } = useQuery({
    queryKey: ['pulls', tabQuery],
    queryFn: async () => {
      switch(tabQuery) {
        case TabKey.MY_PULL_REQUESTS: 
          return queryMyPullRequests(token!);
        case TabKey.REQUESTED_PULL_REQUESTS:
          return queryRequestedPullRequests(token!);
        case TabKey.REVIEWED_PULL_REQUESTS:
          return queryReviewedPullRequests(token!, auth?.login);
        case TabKey.APPROVED_PULL_REQUESTS:
          return queryApprovedPullRequests(token!, auth?.login);
      }
    },
    enabled: !!token,
  });

  return (
    <div style={{ height: `${WINDOW_HEIGHT - HEADER_SECTION_HEIGHT}px` }} className="overflow-y-auto">
      <div className="py-2">
        <p className="text-[#768390] text-[10px] text-center">
          {`Last Update ${format(pulls?.lastUpdatedAt || new Date(), 'HH\'h\' mm\'m\' ss\'s\'')}`}
        </p>
      </div>
      {!pulls ? (
        null
      ) : (
        pulls.items.length === 0 ? (
          <Empty />
        ) : (
          <ul className="divide-y divide-[#373e47]">
            {pulls.items.map((pull => {
              const [repo, owner] = pull.repository_url.split('/').reverse();
              const ownerRepo = `${owner}/${repo}`;
              const labels = pull.draft
                ? [{ name: ' Draft', color: 'cdd9e5' }]
                : pull.labels.map(label => ({ name: label.name, color: label.color }));

              if (tabQuery === TabKey.MY_PULL_REQUESTS) {
                return (
                  <MyPullsItem
                    key={pull.id}
                    title={pull.title}
                    titleUrl={pull.html_url}
                    subtitle={ownerRepo}
                    subtitleUrl={`https://github.com/${ownerRepo}`}
                    labels={labels}
                    caption={formatDistanceToNow(new Date(pull.created_at))}
                    pullRequestUrl={pull.pull_request.url}
                    draft={pull.draft}
                  />
                );
              }
              return (
                <PullsItem
                  key={pull.id}
                  title={pull.title}
                  titleUrl={pull.html_url}
                  subtitle={ownerRepo}
                  subtitleUrl={`https://github.com/${ownerRepo}`}
                  labels={labels}
                  user={{
                    id: pull.user.id,
                    login: pull.user.login,
                  }}
                  createdAt={pull.created_at}
                />
              );
            }))}
          </ul>
        )
      )}
      <Spinner show={isLoading || isRefetching} />
    </div>
  );
}
