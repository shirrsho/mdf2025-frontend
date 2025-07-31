import React from 'react';
import { UserNavbarOne } from '@/components/layout';
import { RouteGuard } from '@/providers';

export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className='relative flex h-screen min-h-screen w-full flex-col bg-background-100 dark:bg-background-dark-100'>
        <div className='z-10'>
          <UserNavbarOne />
        </div>
        <div className='w-full'>{children}</div>
      </div>
    </RouteGuard>
  );
}
