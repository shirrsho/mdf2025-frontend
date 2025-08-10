'use client';
import React, { useState } from 'react';
import { IJob } from '@/interfaces';
import { useGetAllJobs, useDeleteJob } from '@/apis';
import { JobList } from './JobList';

export const CompanyJobList = ({ companyId }: { companyId: string }) => {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    title: '',
    type: '',
    status: '',
  });

  const { data, isLoading, refetch } = useGetAllJobs({
    ...searchParams,
    companyId: companyId,
  });
  const deleteJob = useDeleteJob();

  const handleTableChange = (pagination: any) => {
    setSearchParams((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const handleDelete = async (job: IJob) => {
    await deleteJob.mutateAsync(job.id!);
    refetch();
  };

  const jobs = data?.data || [];
  const totalCount = data?.count || 0;

  return (
    <JobList
      jobs={jobs}
      totalCount={totalCount}
      isLoading={isLoading || !companyId}
      searchParams={searchParams}
      onTableChange={handleTableChange}
      onDelete={handleDelete}
      companyId={companyId}
      mode='company'
    />
  );
};
