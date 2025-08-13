'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetAllWebinars } from '@/apis';
import { WebinarList } from './WebinarList';

export const AdminWebinarList = () => {
  const searchParams = useSearchParams();

  const queryParams = {
    page: parseInt(searchParams.get('pageno') || '1', 10),
    limit: parseInt(searchParams.get('pagesize') || '10', 10),
    title: searchParams.get('title') || '',
    status: searchParams.get('status') || '',
    hostId: searchParams.get('hostId') || '',
  };

  const { data, isLoading } = useGetAllWebinars(queryParams);

  return (
    <WebinarList
      webinars={data?.data || []}
      totalCount={data?.count || 0}
      isLoading={isLoading}
      searchParams={queryParams}
    />
  );
};
