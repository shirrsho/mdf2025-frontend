'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGetAllTimeslots } from '@/apis';
import { TimeslotList } from './TimeslotList';

export const AdminTimeslotList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get('pageno') || '1', 10);
  const limit = parseInt(searchParams.get('pagesize') || '10', 10);
  const timeslotName = searchParams.get('timeslotName') || '';

  const { data, isLoading } = useGetAllTimeslots({
    page,
    limit,
    timeslotName,
  });

  const updateURLParams = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageno', newPage.toString());
    params.set('pagesize', newPageSize.toString());
    router.push(`?${params.toString()}`);
  };

  const handleTableChange = (pagination: any) => {
    updateURLParams(pagination.current, pagination.pageSize);
  };

  return (
    <TimeslotList
      timeslots={data?.data || []}
      totalCount={data?.count || 0}
      isLoading={isLoading}
      searchParams={{ page, limit, timeslotName }}
      onTableChange={handleTableChange}
      mode='admin'
    />
  );
};
