'use client';
import React from 'react';
import { useGetCompanyById } from '@/apis';
import { CreateCompanyForm } from './CreateCompanyForm';

interface ICreateCompanyFormId {
  companyId?: string;
  mode: 'admin' | 'company';
}

export const CreateCompanyFormId: React.FC<ICreateCompanyFormId> = ({
  companyId,
  mode,
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

  return (
    <CreateCompanyForm
      mode={mode}
      initialData={companyData}
      isEdit={!!companyId}
    />
  );
};
