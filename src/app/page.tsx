'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { database } from '@/utils/database';
import { fetchUser } from '@/apis/github';

export default function Home() {
  const router = useRouter();
  const { setData } = useAuthStore();

  useEffect(() => {
    database.getFieldValue<string>('token.github').then(async (token) => {
      if (!token) {
        router.replace('/auth');
        return;
      }
      try {
        const user = await fetchUser(token);
        setData(user);

        router.replace('/pulls');
      } catch (error) {
        router.replace('/auth');
      }
    });
  }, [router, setData]);

  return null;
}
