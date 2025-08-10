'use client';
import React from 'react';
import { useGetJobById } from '@/apis';
import { CreateJobForm } from './CreateJobForm';

interface ICreateJobFormId {
  jobId?: string;
  mode: 'admin' | 'company';
}

export const CreateJobFormId: React.FC<ICreateJobFormId> = ({
  jobId,
  mode,
}) => {
  const { data: jobData, isLoading } = useGetJobById(jobId);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading job details...
        </div>
      </div>
    );
  }

  return <CreateJobForm mode={mode} initialData={jobData} isEdit={!!jobId} />;
};
