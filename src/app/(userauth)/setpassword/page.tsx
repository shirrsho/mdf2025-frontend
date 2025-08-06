'use client';
import React from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { SetPasswordForm } from '@/components/authc';

const SetPasswordPage = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  if (!email) {
    return notFound();
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 lg:px-8'>
      <div className='mx-auto'>{email && <SetPasswordForm email={email} />}</div>
    </div>
  );
};

export default SetPasswordPage;
