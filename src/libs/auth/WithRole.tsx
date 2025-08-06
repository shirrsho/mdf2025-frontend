'use client';
import React from 'react';
import {
  usePathname,
  useRouter,
  useSearchParams,
  notFound,
} from 'next/navigation';
import { LOGIN_PATH } from '@/constants';
import { useGetRolesQuery } from '@/apis';

export function withRole<P>(
  Component: React.ComponentType<P>,
  requiredRoles: string[]
) {
  return function WithRole(props: JSX.IntrinsicAttributes & P) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { isPending, error, data: roles, isFetching } = useGetRolesQuery();

    if (isPending || isFetching) return null;

    const hasRequiredRole = requiredRoles.some((role) => roles?.includes(role));

    if (error || roles?.length === 0) {
      const currentPath = pathname + searchParams.toString();
      const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectPath);
      return null;
    }

    return hasRequiredRole ? <Component {...props} /> : notFound();
  };
}
