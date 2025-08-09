'use client';
import React from 'react';
import { Skeleton } from 'antd';
import { useGetCompanyById } from '@/apis';
import { CompanyDetail } from '../detail';
import { IUser } from '@/interfaces';

export const CompanyProfile = ({ user }: { user: IUser }) => {
  const { data: company, isLoading } = useGetCompanyById(user?.companyId ?? '');

  if (!user || isLoading) {
    return (
      <div className='min-h-screen bg-background-100 p-6 dark:bg-background-dark-100'>
        <div className='mx-auto max-w-6xl'>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  return <CompanyDetail companyId={company?.id ?? ''} />;
};
