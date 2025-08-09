'use client';
import React from 'react';
import { useGetCompanyById } from '@/apis';
import { CreateCompanyForm } from './CreateCompanyForm';

interface ICreateCompanyFormId {
  companyId?: string;
}

export const CreateCompanyFormId: React.FC<ICreateCompanyFormId> = ({
  companyId,
}) => {
  const { data: companyData, isLoading } = useGetCompanyById(companyId);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading company details...
        </div>
      </div>
    );
  }

  return <CreateCompanyForm initialData={companyData} isEdit={!!companyId} />;
};
