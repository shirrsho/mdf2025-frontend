'use client';
import React, { useState } from 'react';
import { IWebinar } from '@/interfaces';
import { useGetAllWebinars, useDeleteWebinar } from '@/apis';
import { WebinarList } from './WebinarList';

export const CompanyWebinarList = ({ companyId }: { companyId: string }) => {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    title: '',
    status: '',
  });

  const { data, isLoading, refetch } = useGetAllWebinars({
    ...searchParams,
    host: companyId,
  });
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
      isLoading={isLoading || !companyId}
      searchParams={searchParams}
      onTableChange={handleTableChange}
      onDelete={handleDelete}
      companyId={companyId}
      mode='company'
    />
  );
};
