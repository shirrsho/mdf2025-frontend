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
    <div className='mx-auto'>{email && <SetPasswordForm email={email} />}</div>
  );
};

export default SetPasswordPage;
