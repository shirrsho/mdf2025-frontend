'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'antd';
import {
  MonitorPlay,
  PieChartIcon,
  FileText,
  Briefcase,
  Building,
  DollarSign,
  LogOut,
  Settings,
} from 'lucide-react';
import { logout } from '@/apis';
import { LOGIN_PATH } from '@/constants';

export const ParticipantMenu = () => {
  const [selectedKey, setSelectedKey] = useState<string[]>(['dashboard']);
  const router = useRouter();
  const pathName = usePathname();
  const pathname = usePathname();
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    if (pathName) {
      const activeMenu = [pathName.split('/')[2]];
      setSelectedKey(activeMenu);
    }
  }, [pathName]);

  const menuItems = [
    {
      label: <Link href='/p/dashboard'>Dashboard</Link>,
      key: 'dashboard',
      icon: <PieChartIcon />,
    },
    {
      label: <Link href='/p/profile'>Profile</Link>,
      key: 'profile',
      icon: <Building />,
    },
    {
      label: <Link href='/p/jobs'>Jobs</Link>,
      key: 'jobs',
      icon: <Briefcase />,
    },
    {
      label: <Link href='/p/webinars'>Webinars</Link>,
      key: 'webinars',
      icon: <MonitorPlay />,
    },
    {
      label: <Link href='/p/applications'>My Applications</Link>,
      key: 'applications',
      icon: <FileText />,
    },
    {
      label: <Link href='/p/payments'>My Payments</Link>,
      key: 'payments',
      icon: <DollarSign />,
    },
    {
      label: <Link href='/p/settings'>Settings</Link>,
      key: 'settings',
      icon: <Settings />,
    },
  ];

  return (
    <div className='flex h-full min-h-[100vh] w-full flex-col items-center justify-between bg-background-100'>
      <div className='flex h-full w-full flex-col items-center justify-between'>
        <div>
          <div className='flex h-[80px] w-full flex-col items-center justify-center border-b-[2px] border-b-background-200 hover:cursor-pointer'>
            <Image
              src='/logo.png'
              className={`h-[48px] w-[96px] object-contain`}
              onClick={() => {
                router.push('/admin');
              }}
              style={{
                transition: 'width 0.5s ease-in-out',
              }}
              width={100}
              height={100}
              alt=''
            />
          </div>
          <Menu
            items={menuItems}
            style={{
              width: 220,
              transition: 'width 0.5s ease-in-out',
              margin: '10px',
              border: '0px solid #E5E5E5',
            }}
            className='!bg-background-100 dark:!bg-background-dark-100'
            selectedKeys={selectedKey}
            mode='inline'
          />
        </div>
        <div
          className='flex w-full items-center justify-center gap-2 border-t border-gray-500 py-3 text-gray-400 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-600'
          onClick={async () => {
            await logout();
            router.push(redirectPath);
            window.location.reload();
          }}
        >
          <LogOut size={16} rotate={180} />
          <span className='font-medium'>Logout</span>
        </div>
      </div>
    </div>
  );
};
