'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Space } from 'antd';

import { logout } from '@/apis';
import { LOGIN_PATH } from '@/constants';
import { useAdminLayoutContext } from '@/contexts';

export const AdminNavbar = () => {
  const { navHeader } =
    useAdminLayoutContext();
  const router = useRouter();
  const pathname = usePathname();
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`;

  return (
    <div
      className='border-b-1 sticky top-0 z-50 px-6 flex h-[60px] items-center justify-between bg-background-100 shadow-sm dark:border-gray-700 dark:bg-background-dark-100 md:h-[80px]'
      // style={{ padding: 0 }}
    >
      {/* header left part */}
      <div className='flex flex-row'>
        <Space>
          {/* {menuButton} */}
          <div className='relative hidden h-[50px] py-2 md:block'>
            <div className='font-Outfit tracking-0.25 text-[14px] font-semibold leading-[28px] dark:text-white md:text-[18px]'>
              {navHeader}
            </div>
          </div>
        </Space>
      </div>

      {/* header right part */}
      <div className=''>
        <Button
          onClick={async () => {
            await logout();
            router.push(redirectPath);
            window.location.reload();
          }}
          danger
          type='primary'
        >
          Log Out
        </Button>
        {/* <Space size='large'>
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
        </Space> */}
      </div>
    </div>
  );
};
