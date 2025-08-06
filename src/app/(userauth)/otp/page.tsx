'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { OTPForm } from '@/components/authc';

const SendOTP = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get('email');
  const type = searchParams.get('t');

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 lg:px-8'>
      <div className='mx-auto'>
        {!email && (
          <div className='rounded-lg bg-background-300 border border-background-200 px-8 py-10 text-center shadow-lg'>
            <div className='text-xl font-semibold text-white mb-2'>Page not found</div>
            <div className='text-gray-400'>The requested page could not be found.</div>
          </div>
        )}
        {email && <OTPForm email={email} isVerifyOnly={type === 'new'} />}
      </div>
    </div>
  );
};

export default SendOTP;
