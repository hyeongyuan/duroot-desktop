'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { database } from '@/utils/database';
import { fetchUser } from '@/apis/github';
import { useTokenStore } from '@/stores/token';
import { type GithubUser } from '@/types/github';

export interface AuthProps {
  auth: GithubUser;
}

export const withAuth = <P extends AuthProps>(WrappedComponent: React.ComponentType<P>) => {
  const Component = (props: Omit<P, keyof AuthProps>) => {
    const router = useRouter();
    const { data: authData, setData: setAuthData } = useAuthStore();
    const { setData: setTokenData } = useTokenStore();

    useEffect(() => {
      if (authData) {
        return;
      }
      database.getFieldValue<string>('token.github').then(async (token) => {
        if (!token) {
          router.replace('/auth');
          return;
        }
        setTokenData(token);
        try {
          const user = await fetchUser(token);
          setAuthData(user);
        } catch (error) {
          router.replace('/auth');
        }
      });
    }, [router, authData, setAuthData, setTokenData]);

    if (!authData) {
      return null;
    }
    return <WrappedComponent {...(props as P)} auth={authData} />;
  };
  return Component;
};
