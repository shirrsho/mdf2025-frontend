'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Drawer } from 'antd';
import { Cog, ChevronRight, LogOut } from 'lucide-react';
import { logout, useGetUser } from '@/apis';
import { LOGIN_PATH } from '@/constants';
import { isBangla } from '@/utils';
import { AppImage } from '@/components/common';
import { Role } from '@/enums';

export const ProfileDrawerOne: React.FC = () => {
  const { data } = useGetUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = pathname + searchParams.toString();
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(currentPath)}`;

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const menuItems = [
    {
      href: data?.user?.rolePermission === Role.ADMIN ? '/admin/dashboard' : data?.user?.rolePermission === Role.COMPANY ? '/c/dashboard' : 'p/dashboard',
      label: 'Dashboard',
      icon: (
        <Cog className='mr-3 h-5 w-5 text-paragraph dark:text-paragraph-dark' />
      ),
    },
  ];

  if (!data?.user) {
    return (
      <Link href={redirectPath}>
        <button className='rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-heading transition-colors duration-200 hover:bg-primary-600 dark:text-heading-dark'>
          Login <ChevronRight className='text-xs' />
        </button>
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center space-x-1 rounded-full bg-background-200 p-1 transition-colors duration-200 hover:bg-background-300 dark:bg-background-dark-200 dark:hover:bg-background-dark-300'
      >
        {data?.user?.imageUrl ? (
          <AppImage
            src={`${data?.user?.imageUrl}`}
            height={32}
            width={32}
            className='h-[24px] w-[24px] rounded-full object-cover md:h-[32px] md:w-[32px] lg:h-[40px] lg:w-[40px]'
          />
        ) : (
          <div className='flex h-[24px] w-[24px] items-center justify-center rounded-full bg-primary-400 md:h-[32px] md:w-[32px] lg:h-[40px] lg:w-[40px]'>
            <span
              className={`text-sm font-medium text-black dark:text-black ${isBangla(data?.user?.name) ? '!font-bangla' : ''}`}
            >
              {data?.user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span
          className={`hidden pr-2 text-sm font-medium text-white dark:text-white md:inline ${isBangla(data?.user?.name) ? '!font-bangla' : ''}`}
        >
          {data?.user?.name?.split(' ')[0]}
        </span>
      </button>

      <Drawer
        title='User Menu'
        placement='right'
        onClose={() => setIsOpen(false)}
        open={isOpen}
        width={300}
      >
        <div className='px-4 py-2'>
          <p
            className={`text-sm font-medium text-heading dark:text-heading-dark ${isBangla(data?.user?.name) ? '!font-bangla' : ''}`}
          >
            {data?.user?.name}
          </p>
          {/* <Link
            href={`/my-profile`}
            className='text-xs text-primary hover:underline dark:text-primary-dark'
            onClick={() => setIsOpen(false)}
          >
            View Profile
          </Link> */}
        </div>
        <div className='border-t border-background dark:border-background-dark'>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className='flex items-center px-4 py-2 text-sm text-heading hover:bg-background-200 dark:text-heading-dark dark:hover:bg-background-dark-200'
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
        <div className='border-t border-background dark:border-background-dark'>
          <button
            onClick={handleLogout}
            className='flex w-full items-center px-4 py-2 text-sm text-danger hover:bg-background-200 dark:hover:bg-background-dark-300'
          >
            <LogOut className='mr-3 h-5 w-5 text-paragraph dark:text-paragraph-dark' />
            Log Out
          </button>
        </div>
      </Drawer>
    </>
  );
};
