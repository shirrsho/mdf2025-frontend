'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { IJob } from '@/interfaces';
import { useGetAllJobs, useDeleteJob } from '@/apis';
import { JobList } from './JobList';
import { DEFAULT_PAGE_SIZE } from '@/constants';

export const AdminJobList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get pagination params from URL
  const page = parseInt(searchParams.get('pageno') || '1', 10);
  const limit = parseInt(searchParams.get('pagesize') || DEFAULT_PAGE_SIZE, 10);

  const [localSearchParams, setLocalSearchParams] = useState({
    page,
    limit,
    title: '',
    type: '',
    status: '',
  });

  // Update local state when URL changes
  useEffect(() => {
    setLocalSearchParams((prev) => ({
      ...prev,
      page,
      limit,
    }));
  }, [page, limit]);

  const { data, isLoading, refetch } = useGetAllJobs(localSearchParams);
  const deleteJob = useDeleteJob();

  const handleTableChange = (pagination: any) => {
    const newPage = pagination.current;
    const newLimit = pagination.pageSize;

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageno', newPage.toString());
    params.set('pagesize', newLimit.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
      isLoading={isLoading}
      searchParams={localSearchParams}
      onTableChange={handleTableChange}
      onDelete={handleDelete}
      mode='admin'
    />
  );
};
