'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, Button, Dropdown, Space } from 'antd';
import {
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import type { MenuProps } from 'antd';

import { logout, useGetUser } from '@/apis';
import { LOGIN_PATH } from '@/constants';
import { useAdminLayoutContext } from '@/contexts';
import { DarkModeToggle } from '@/components/common';

type MenuItem = Required<MenuProps>['items'][number];

export const AdminNavbar = () => {
  const { collapsed, toggleCollapsed, drawer, setDrawer, navHeader } =
    useAdminLayoutContext();
  const { data } = useGetUser();
  const router = useRouter();
  const pathname = usePathname();
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`;

  const items: MenuItem[] = [
    {
      label: <Link href={'/admin/dashboard'}>Dashboard</Link>,
      key: 'dashboard',
      icon: <LayoutDashboard />,
    },
    {
      key: 'divider',
      type: 'divider',
    },
    {
      label: (
        <span
          onClick={async () => {
            await logout();
            router.push(redirectPath);
            window.location.reload();
          }}
        >
          Log Out
        </span>
      ),
      icon: <LogOut />,
      key: 'logout',
    },
  ];

  const menuButton = (
    <>
      <Button
        type='text'
        className='!hidden dark:text-gray-200 md:!block'
        icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        onClick={toggleCollapsed}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <Button
        type='text'
        className='dark:text-gray-200 md:!hidden'
        icon={!drawer ? <PanelLeftOpen /> : <PanelLeftClose />}
        onClick={() => setDrawer(!drawer)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
    </>
  );

  return (
    <div
      className='border-b-1 sticky top-0 z-50 flex h-[60px] items-center justify-between bg-background-100 shadow-sm dark:border-gray-700 dark:bg-background-dark-100 md:h-[80px]'
      style={{ padding: 0 }}
    >
      {/* header left part */}
      <div className='flex flex-row'>
        <Space>
          {menuButton}
          <div className='relative hidden h-[50px] py-2 md:block'>
            <div className='font-Outfit tracking-0.25 text-[14px] font-semibold leading-[28px] dark:text-white md:text-[18px]'>
              {navHeader}
            </div>
          </div>
        </Space>
      </div>

      {/* header right part */}
      <div className='mr-[20px]'>
        <Space size='large'>
          <div className='h-[40px] rounded-[6px] bg-background-100 dark:bg-background-dark-100'>
            <div className='flex h-[40px] flex-row items-center justify-center gap-2 px-[10px]'>
              <Avatar
                size='small'
                src={
                  data?.user?.imageUrl
                    ? `${process.env.NEXT_PUBLIC_BUCKET_URI}/${data?.user?.imageUrl}`
                    : null
                }
                icon={data?.user?.imageUrl ? null : <CircleUserRound />}
              />
              <div className='font-poppins hidden text-[13px] font-medium leading-[20px] text-heading dark:text-gray-200 md:block'>
                {data?.user?.name ?? (
                  <Link href={`${redirectPath}`} className='dark:text-blue-400'>
                    Login
                  </Link>
                )}
              </div>
              {data?.user ? (
                <Dropdown menu={{ items }}>
                  <ChevronDown className='dark:text-gray-200' />
                </Dropdown>
              ) : null}
            </div>
          </div>
          <DarkModeToggle />
        </Space>
      </div>
    </div>
  );
};
