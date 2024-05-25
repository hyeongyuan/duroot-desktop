'use client';

import { useAuthStore } from '@/stores/auth';
import { PullsTabs } from '@/components/github/pulls-tabs';
import { Header } from '@/components/github/header';

export default function Pulls() {
  const { data } = useAuthStore();

  if (!data) {
    return null;
  }
  return (
    <div className="w-full">
      <Header />
      <PullsTabs />
      <div>{data.id}</div>
    </div>
  );
}
