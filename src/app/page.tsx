'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { database } from '@/utils/database';
import { fetchUser } from '@/apis/github';
import { useTokenStore } from '@/stores/token';

export default function Home() {
  const router = useRouter();
  const { setData: setAuthData } = useAuthStore();
  const { setData: setTokenData } = useTokenStore();

  useEffect(() => {
    database.getFieldValue<string>('token.github').then(async (token) => {
      if (!token) {
        router.replace('/auth');
        return;
      }
      setTokenData(token);
      try {
        const user = await fetchUser(token);
        setAuthData(user);

        router.replace('/pulls');
      } catch (error) {
        router.replace('/auth');
      }
    });
  }, [router, setAuthData, setTokenData]);

  return null;
}
