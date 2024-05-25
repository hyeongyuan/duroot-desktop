'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { database } from '@/utils/database';
import { fetchUser } from '@/apis/github';
import { type GithubUser } from '@/types/github';
import { useRouter } from 'next/navigation';

export interface AuthProps {
  auth: GithubUser;
}

export const withAuth = <P extends AuthProps>(WrappedComponent: React.ComponentType<P>) => {
  const Component = (props: Omit<P, keyof AuthProps>) => {
    const router = useRouter();
    const { data, setData } = useAuthStore();

    useEffect(() => {
      if (data) {
        return;
      }
      database.getFieldValue<string>('token.github').then(async (token) => {
        if (!token) {
          router.replace('/auth');
          return;
        }
        try {
          const user = await fetchUser(token);
          setData(user);
        } catch (error) {
          router.replace('/auth');
        }
      });
    }, [router, data, setData]);

    if (!data) {
      return null;
    }
    return <WrappedComponent {...(props as P)} auth={data} />;
  };
  return Component;
};
