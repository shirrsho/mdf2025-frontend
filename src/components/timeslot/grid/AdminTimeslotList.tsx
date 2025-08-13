'use client';
import React, { useState } from 'react';
import { useGetAllTimeslots } from '@/apis';
import { TimeslotList } from './TimeslotList';

export const AdminTimeslotList = () => {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    timeslotName: '',
    isAvailable: '',
  });

  const { data, isLoading } = useGetAllTimeslots(searchParams);

  const handleTableChange = (pagination: any) => {
    setSearchParams((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  return (
    <TimeslotList
      timeslots={data?.data || []}
      totalCount={data?.count || 0}
      isLoading={isLoading}
      searchParams={searchParams}
      onTableChange={handleTableChange}
      mode='admin'
    />
  );
};
