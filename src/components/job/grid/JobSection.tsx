'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useGetAllPublicJobs } from '@/apis';
import { CustomPagination, EmptyState, LogoLoader } from '@/components/common';
import { JobCard } from '../card';

export const JobSection = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageNo = parseInt(searchParams.get('pageno') || '1', 10);
  const pageSize = parseInt(
    searchParams.get('pagesize') || DEFAULT_PAGE_SIZE,
    10
  );

  const [query, setQuery] = useState<any>({
    page: pageNo,
    limit: pageSize,
    where: {},
  });
  const router = useRouter();

  const { data, isLoading } = useGetAllPublicJobs(query);

  useEffect(() => {
    const newQuery: any = {};

    newQuery.page = parseInt(searchParams.get('pageno') || '1', 10);
    newQuery.limit = parseInt(
      searchParams.get('pagesize') || DEFAULT_PAGE_SIZE,
      10
    );

    const filterKeys = ['jobName'];

    filterKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        if (key.startsWith('min') || key.startsWith('max')) {
          newQuery[key] = parseInt(value, 10);
        } else if (key.endsWith('After') || key.endsWith('Before')) {
          newQuery[key] = new Date(value).toISOString();
        } else if (key.startsWith('is') || key.startsWith('has')) {
          newQuery[key] = value === 'true';
        } else {
          newQuery[key] = value;
        }
      }
    });

    setQuery(newQuery);
  }, [searchParams]);

  return (
    <div className='container mx-auto px-4'>
      <div className='mb-6'>
        <div className='text-3xl font-semibold'>
          <span>Browse</span>{' '}
          <span className='font-playfair italic text-primary'>Jobs</span>
        </div>
        <div className='text-gray-300'>
          Discover amazing job opportunities and advance your career
        </div>
      </div>
      {isLoading ? (
        <LogoLoader />
      ) : (
        <>
          {data?.count === 0 ? (
            <EmptyState message={'No Job Yet'} />
          ) : (
            <>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
                {data?.data?.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            </>
          )}
        </>
      )}
      <CustomPagination
        current={query.page || 1}
        pageSize={query.limit || parseInt(DEFAULT_PAGE_SIZE, 10)}
        total={data?.count || 0}
        onChange={(page, pageSize) => {
          const params = new URLSearchParams(window.location.search);
          params.set('pageno', page.toString());
          if (pageSize) {
            params.set('pagesize', pageSize.toString());
          }
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        itemType='jobs'
      />
    </div>
  );
};
