'use client';
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BadgeCheck } from 'lucide-react';
import { HOME_PATH } from '@/constants';

export const SuccessSetPasswordMessage: React.FC<object> = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='rounded-md bg-white px-10 py-6 sm:mx-auto sm:w-full sm:max-w-sm'>
        <div className='space-y-5'>
          <div className='max-w-md'>
            <div className='mb-3 flex flex-col items-center space-y-4'>
              <div className='rounded-full bg-green-50 p-3'>
                <div className='rounded-full bg-green-100 p-3'>
                  <BadgeCheck className='h-8 w-8' />
                </div>
              </div>
              <h2 className='text-2xl font-semibold'>Password Reset</h2>
              <p className='px-2 text-center text-[14px] text-gray-500'>
                {` Your password has been successfully reset. Click below to go log in page.`}
              </p>
            </div>
          </div>
          <Link
            href={`/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
            className='flex transform justify-center rounded-md bg-[#036c3c] px-4 py-3 text-white transition-colors duration-200 hover:bg-green-600 focus:bg-gray-600 focus:outline-none'
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};
