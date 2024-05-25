'use client';

import { Header } from '@/components/github/header';
import { PullsTabs } from '@/components/github/pulls-tabs';
import { PullsList } from '@/components/github/pulls-list';
import { withAuth } from '@/hoc/with-auth';

function Pulls() {
  return (
    <div className="w-full">
      <Header />
      <PullsTabs />
      <PullsList />
    </div>
  );
}

export default withAuth(Pulls);
