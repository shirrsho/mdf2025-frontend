'use client';
import React, { useState } from 'react';
import { IWebinar } from '@/interfaces';
import { useGetAllWebinars, useDeleteWebinar } from '@/apis';
import { WebinarList } from './WebinarList';

export const AdminWebinarList = () => {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    title: '',
    status: '',
    hostId: '',
  });

  const { data, isLoading, refetch } = useGetAllWebinars(searchParams);
  const deleteWebinar = useDeleteWebinar();

  const handleTableChange = (pagination: any) => {
    setSearchParams((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const handleDelete = async (webinar: IWebinar) => {
    await deleteWebinar.mutateAsync(webinar.id!);
    refetch();
  };

  const webinars = data?.data || [];
  const totalCount = data?.count || 0;

  return (
    <WebinarList
      webinars={webinars}
      totalCount={totalCount}
      isLoading={isLoading}
      searchParams={searchParams}
      onTableChange={handleTableChange}
      onDelete={handleDelete}
      mode='admin'
    />
  );
};
