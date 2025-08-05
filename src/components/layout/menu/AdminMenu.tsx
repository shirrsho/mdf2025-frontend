'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'antd';
import {
  Mail,
  MonitorPlay,
  PieChartIcon,
  File,
  Workflow,
  History,
  FileText,
  LockKeyhole,
  UserIcon,
  Briefcase,
  Building,
  DollarSign,
  Settings,
} from 'lucide-react';
import { useAdminLayoutContext } from '@/contexts';

export const AdminMenu = () => {
  const { collapsed } = useAdminLayoutContext();
  const [selectedKey, setSelectedKey] = useState<string[]>(['dashboard']);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName) {
      const activeMenu = [pathName.split('/')[2]];
      setSelectedKey(activeMenu);
    }
  }, [pathName]);

  const menuItems = [
    {
      label: <Link href='/admin/dashboard'>Dashboard</Link>,
      key: 'dashboard',
      icon: <PieChartIcon />,
    },
    {
      label: <Link href='/admin/users'>Users</Link>,
      key: 'users',
      icon: <UserIcon />,
    },
    {
      label: <Link href='/admin/companies'>Companies</Link>,
      key: 'companies',
      icon: <Building />,
    },
    {
      label: <Link href='/admin/participants'>Participants</Link>,
      key: 'participants',
      icon: <FileText />,
    },
    {
      label: <Link href='/admin/jobs'>Jobs</Link>,
      key: 'jobs',
      icon: <Briefcase />,
    },
    {
      label: <Link href='/admin/webinars'>Webinars</Link>,
      key: 'webinars',
      icon: <MonitorPlay />,
    },
    {
      label: <Link href='/admin/users'>Payments</Link>,
      key: 'payments',
      icon: <DollarSign />,
    },
    {
      label: <Link href='/admin/settings'>Settings</Link>,
      key: 'settings',
      icon: <Settings />,
    },
    // {
    //   label: <Link href='/admin/template'>Template</Link>,
    //   key: 'template',
    //   icon: <MonitorPlay />,
    // },
  ];

  return (
    <div className='flex h-full min-h-[100vh] w-full flex-col items-center justify-between bg-background-100'>
      <div className='flex w-full flex-col items-center justify-center'>
        <div className='flex h-[80px] w-full flex-col items-center justify-center border-b-[2px] border-b-background-200 hover:cursor-pointer'>
          <Image
            src='/logo-white.png'
            className={`object-contain ${collapsed ? 'h-[48px] w-[40px]' : 'h-[48px] w-[96px]'}`}
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
            width: collapsed ? 80 : 220,
            transition: 'width 0.5s ease-in-out',
            margin: '10px',
            border: '0px solid #E5E5E5',
          }}
          className='!bg-background-100 dark:!bg-background-dark-100'
          selectedKeys={selectedKey}
          mode='inline'
        />
      </div>
    </div>
  );
};
