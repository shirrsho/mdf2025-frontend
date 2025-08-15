'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { IWebinar } from '@/interfaces';
import { useGetAllWebinars, useDeleteWebinar } from '@/apis';
import { WebinarList } from './WebinarList';
import { DEFAULT_PAGE_SIZE } from '@/constants';

export const CompanyWebinarList = ({ companyId }: { companyId: string }) => {
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

  const { data, isLoading, refetch } = useGetAllWebinars({
    ...localSearchParams,
    host: companyId,
  });
  const deleteWebinar = useDeleteWebinar();

  const handleTableChange = (pagination: any) => {
    const newPage = pagination.current;
    const newLimit = pagination.pageSize;

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageno', newPage.toString());
    params.set('pagesize', newLimit.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
      searchParams={localSearchParams}
      onTableChange={handleTableChange}
      onDelete={handleDelete}
      companyId={companyId}
      mode='company'
    />
  );
};
