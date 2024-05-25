'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { database } from '@/utils/database';
import { fetchUser } from '@/apis/github';

export default function Home() {
  const router = useRouter();
  const auth = useAuthStore();

  useEffect(() => {
    database.getFieldValue<string>('token.github').then(async (token) => {
      if (!token) {
        router.replace('/auth');
        return;
      }
      try {
        const user = await fetchUser(token);
        console.log(user);
      } catch (error) {
        router.replace('/auth');
      }
    });
  }, [auth, router]);

  return null;
}
