import React from 'react';
import { SuccessSetPasswordMessage } from '@/components/authc';

const SuccessNewPasswordPage = () => {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden'>
      <div className='m-6 rounded-md'>
        <div className='mx-auto'>
          <SuccessSetPasswordMessage />
        </div>
      </div>
    </div>
  );
};

export default SuccessNewPasswordPage;
