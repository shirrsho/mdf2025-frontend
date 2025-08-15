'use client';
import React from 'react';
import { Card } from 'antd';
import { ChangePasswordForm } from '@/components/authc';

const SettingsPage = () => {
  return (
    <div className='min-h-screen bg-background-100 py-8 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-2xl px-6'>
        {/* Security Settings */}
        <Card className='border-0 bg-white shadow-lg dark:bg-background-dark-200'>
          <div className='flex justify-center'>
            <ChangePasswordForm />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
