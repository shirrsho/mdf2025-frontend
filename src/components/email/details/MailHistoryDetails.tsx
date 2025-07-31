'use client';
import React from 'react';
import { useGetMailHistoryById } from '@/apis';
import { HtmlRenderer } from '@/components/common';

interface IProps {
  id: string;
}

export const MailHistoryDetails: React.FC<IProps> = ({ id }) => {
  const { data } = useGetMailHistoryById(id);
  const year =
    data?.sentTimes && data.sentTimes.length
      ? new Date(data.sentTimes?.[0]).getFullYear()
      : new Date().getFullYear();

  return (
    <>
      <div className='flex w-full justify-center bg-gray-100 p-4'>
        <div className='w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-md'>
          <div className='bg-primary p-5 text-center'>
            <a href={'/'}>
              <img
                src={'/logo.png'}
                alt='Company Logo'
                className='mx-auto max-w-[150px]'
              />
            </a>
          </div>

          <HtmlRenderer className='p-5 text-center' htmlString={data?.body} />

          <div className='mt-5 rounded-md bg-gray-200 p-4 text-center'>
            <img
              src={'/logo.png'}
              alt='App Logo'
              className='mx-auto max-w-[100px]'
            />
          </div>

          <div className='bg-primary p-4 text-center text-white'>
            <p>
              &copy; {year} {process.env.NEXT_PUBLIC_APP_NAME}. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
