'use client';
import React, { useState } from 'react';
import { notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useGetJobById,
  useCreateJob,
  useUpdateJob,
  useGetAllCompanys,
} from '@/apis';
import { handleErrorToast } from '@/utils';
import { JobForm } from './JobForm';

interface ICreateJobFormId {
  jobId?: string;
  mode: 'admin' | 'company';
}

export const CreateJobFormId: React.FC<ICreateJobFormId> = ({
  jobId,
  mode,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const { data: jobData, isLoading: jobLoading } = useGetJobById(jobId);
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const { data: companiesData, isLoading: companiesLoading } =
    useGetAllCompanys({ limit: 100 });

  // Transform company data to options format
  const companyOptions =
    companiesData?.data?.map((company) => ({
      label: company.name,
      value: company.id!,
    })) || [];

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const jobDataPayload = {
        ...values,
        applicationDeadline: values.applicationDeadline?.toISOString(),
      };

      let result = null;
      if (!!jobId && jobData?.id) {
        result = await updateJob.mutateAsync({
          ...jobDataPayload,
          id: jobData.id,
        });
        notification.success({
          message: 'Success',
          description: 'Job updated successfully!',
          placement: 'topRight',
        });
      } else {
        result = await createJob.mutateAsync(jobDataPayload);
        notification.success({
          message: 'Success',
          description: 'Job created successfully!',
          placement: 'topRight',
        });
      }

      // Redirect based on mode
      router.push(
        mode === 'admin' ? `/admin/jobs/${result?.id}` : `/c/jobs/${result?.id}`
      );
    } catch (error) {
      handleErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (jobLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading job details...
        </div>
      </div>
    );
  }

  return (
    <JobForm
      initialData={jobData}
      isEdit={!!jobId}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      companyOptions={companyOptions}
      companiesLoading={companiesLoading}
      companyId={searchParams?.get('c') ?? undefined}
    />
  );
};
