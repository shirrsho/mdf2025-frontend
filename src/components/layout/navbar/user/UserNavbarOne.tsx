'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Drawer } from 'antd';
import { Menu } from 'lucide-react';
import { DarkModeToggle } from '@/components/common';
import { ProfileDrawerOne } from './drawers';
import { NotificationBar } from './notification';

export const UserNavbarOne: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('/');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const activeMenu = pathname.split('/')[1];
    setActiveMenu(activeMenu);
  }, [pathname]);

  const navigation = [{ name: 'Home', href: '/', key: '' }];

  return (
    <nav className='sticky top-0 z-20 mb-20 w-full'>
      <div className='fixed top-0 z-20 w-full bg-background-100 shadow transition-all duration-300 dark:bg-background-dark-100'>
        <div className='mx-auto max-w-7xl px-3'>
          <div className='flex h-20 items-center justify-between md:h-20'>
            <div className='flex items-center gap-2'>
              <div className='flex md:hidden'>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className='inline-flex items-center justify-center rounded-md p-2 text-paragraph hover:bg-gray-100 hover:text-heading'
                >
                  <span className='sr-only'>Open main menu</span>
                  <Menu className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <Link href={'/'} className='flex-shrink-0'>
                <Image
                  src={
                    resolvedTheme === 'dark' ? '/logo-white.png' : '/logo.png'
                  }
                  alt='logo'
                  height={500}
                  width={500}
                  className='h-auto max-w-16 md:max-w-24 lg:max-w-28'
                />
              </Link>
            </div>
            <div className='hidden md:flex md:space-x-4 lg:space-x-8'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 font-medium transition-colors duration-200 md:text-xs lg:text-sm ${
                    activeMenu === item.key
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-heading hover:text-primary dark:text-heading-dark'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className='flex items-center space-x-2 lg:space-x-4'>
              <NotificationBar />
              <ProfileDrawerOne />
              <DarkModeToggle />
            </div>
          </div>
        </div>

        <Drawer
          title={
            <Image
              src={resolvedTheme === 'dark' ? '/logo-white.png' : '/logo.png'}
              alt='logo'
              height={40}
              width={100}
            />
          }
          placement='left'
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width='80%'
          styles={{
            body: { padding: 0 },
            header: { borderBottom: 'none' },
          }}
        >
          <div className='flex h-full flex-col'>
            <div className='flex-grow'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-6 py-4 text-base font-medium transition-colors duration-200 ${
                    activeMenu === item.key
                      ? 'text-primary_hover bg-background-dark'
                      : 'text-heading hover:text-primary dark:text-heading-dark'
                  }`}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </Drawer>
      </div>
    </nav>
  );
};
