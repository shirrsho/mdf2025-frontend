import React from 'react';
import { ForgotPasswordForm } from '@/components/authc';

const ForgetPassword = () => {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden'>
      <div className='m-6 rounded-md'>
        <div className='mx-auto'>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
