'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { LOGIN_PATH, PUBLIC_PATHS } from '@/constants';
import { useGetOptionalUser, useGetUserFrontendPermissions } from '@/apis';
import { notFound } from 'next/navigation';
import { isRouteAllowed } from '@/utils';

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const currentPath =
    typeof window === 'undefined'
      ? ''
      : decodeURIComponent(window.location.pathname);

  const { data: allowedRoutes } = useGetUserFrontendPermissions();
  const { data: user, isLoading: userLoading } = useGetOptionalUser();

  const isPublicRoute = PUBLIC_PATHS.includes(currentPath);

  useEffect(() => {
    if (!user && !isPublicRoute && !userLoading) {
      router.push(`${LOGIN_PATH}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, userLoading, isPublicRoute, currentPath, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  if (
    (allowedRoutes?.length ?? 0) > 0 &&
    !isRouteAllowed(currentPath, allowedRoutes ?? [])
  ) {
    return notFound();
  }

  return <>{children}</>;
};
