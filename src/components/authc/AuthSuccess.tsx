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
      <div className='rounded-lg bg-background-300 border border-background-200 px-10 py-8 shadow-lg sm:mx-auto sm:w-full sm:max-w-sm'>
        <div className='space-y-6'>
          <div className='max-w-md'>
            <div className='mb-6 flex flex-col items-center space-y-4'>
              <div className='rounded-full bg-green-500/20 p-3'>
                <div className='rounded-full bg-green-500/30 p-3'>
                  <BadgeCheck className='h-8 w-8 text-green-400' />
                </div>
              </div>
              <h2 className='text-2xl font-semibold text-white'>Password Reset</h2>
              <p className='px-2 text-center text-sm text-gray-400'>
                {`Your password has been successfully reset. Click below to go to the login page.`}
              </p>
            </div>
          </div>
          <Link
            href={`/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
            className='flex transform justify-center rounded-md bg-primary border-primary px-4 py-3 text-white transition-colors duration-200 hover:bg-primary-400 focus:bg-primary-500 focus:outline-none'
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};
