'use client';
import React from 'react';
import { Space } from 'antd';
import { useAdminLayoutContext } from '@/contexts';
import { useGetUser } from '@/apis';
import Image from 'next/image';

export const AdminNavbar = () => {
  const { navHeader } = useAdminLayoutContext();
  const { data } = useGetUser();

  return (
    <div
      className='border-b-1 sticky top-0 z-50 px-6 flex h-[60px] items-center justify-between bg-background-100 shadow-sm dark:border-gray-700 dark:bg-background-dark-100 md:h-[80px]'
    >
      <div className='flex flex-row'>
        <Space>
          <div className='relative hidden h-[50px] py-2 md:block'>
            <div className='font-Outfit tracking-0.25 text-[14px] font-semibold leading-[28px] dark:text-white md:text-[18px]'>
              {navHeader}
            </div>
          </div>
        </Space>
      </div>

      <div className="flex items-center gap-3">
        <Image 
          src={data?.user?.imageUrl 
            ? `${process.env.NEXT_PUBLIC_BUCKET_URI}/${data.user.imageUrl}`
            : '/placeholder-user.jpg'
          } 
          alt=''
          width={40} 
          height={40}
          className="object-cover rounded-md"
        />
        <div className="hidden md:block pr-2">
          <div className="font-medium text-sm dark:text-white">{data?.user?.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{data?.user?.email}</div>
        </div>
      </div>
    </div>
  );
};
