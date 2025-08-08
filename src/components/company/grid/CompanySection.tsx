'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useGetAllPublicCompanys } from '@/apis';
import { AppPagination, EmptyState, LogoLoader } from '@/components/common';
import { CompanyCard } from '../card';

export const CompanySection = () => {
  const searchParams = useSearchParams();

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

  const { data, isLoading } = useGetAllPublicCompanys(query);

  useEffect(() => {
    const newQuery: any = {};

    newQuery.page = parseInt(searchParams.get('pageno') || '1', 10);
    newQuery.limit = parseInt(
      searchParams.get('pagesize') || DEFAULT_PAGE_SIZE,
      10
    );

    const filterKeys = ['companyName'];

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
    <div className='container mx-auto px-4 py-8'>
      {isLoading ? (
        <LogoLoader />
      ) : (
        <>
          {data?.count === 0 ? (
            <EmptyState message={'No Company Yet'} />
          ) : (
            <>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {data?.data?.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
              <AppPagination total={data?.count || 0} />
            </>
          )}
        </>
      )}
    </div>
  );
};
