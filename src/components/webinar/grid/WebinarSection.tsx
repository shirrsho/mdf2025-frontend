'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useGetAllPublicWebinars } from '@/apis';
import { CustomPagination, EmptyState, LogoLoader } from '@/components/common';
import { WebinarCard } from '../card';
import dayjs from 'dayjs';

export const WebinarSection = () => {
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
    currentTime: dayjs().toISOString(),
    where: {},
  });
  const router = useRouter();
  const { data, isLoading } = useGetAllPublicWebinars(query);

  useEffect(() => {
    const newQuery: any = {};

    newQuery.page = parseInt(searchParams.get('pageno') || '1', 10);
    newQuery.limit = parseInt(
      searchParams.get('pagesize') || DEFAULT_PAGE_SIZE,
      10
    );
    newQuery.currentTime = dayjs().toISOString();

    const filterKeys = ['webinarName'];

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
          <span className='font-playfair italic text-primary'>Webinars</span>
        </div>
        <div className='text-gray-300'>
          Discover upcoming webinars and grow your knowledge
        </div>
      </div>
      {isLoading ? (
        <LogoLoader />
      ) : (
        <>
          {data?.count === 0 ? (
            <EmptyState message={'No Webinar Yet'} />
          ) : (
            <>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
                {data?.data?.map((webinar) => (
                  <WebinarCard key={webinar.id} webinar={webinar} />
                ))}
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
          // window.history.pushState({}, '', `${window.location.pathname}?${params}`);
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        itemType='webinars'
      />
    </div>
  );
};
