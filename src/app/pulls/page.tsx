'use client';

import { PullsTabs } from '@/components/github/pulls-tabs';
import { Header } from '@/components/github/header';
import { withAuth } from '@/hoc/with-auth';

function Pulls() {
  return (
    <div className="w-full">
      <Header />
      <PullsTabs />
    </div>
  );
}

export default withAuth(Pulls);
