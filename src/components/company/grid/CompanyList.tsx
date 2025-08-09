'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Table, Button, Card, Space, Typography } from 'antd';
import { CheckCircle, Plus, Search } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useDeleteCompany, useGetAllCompanys } from '@/apis';
import { ICompany } from '@/interfaces';
import {
  ActionButton,
  TableTopButton,
  AppPagination,
  TableFilterSearch,
  LogoLoader,
} from '@/components/common';
import { handleErrorToast } from '@/utils';

const { Title } = Typography;

export const CompanyList = () => {
  const router = useRouter();
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

  const { data, isLoading, refetch } = useGetAllCompanys(query);
  const deleteCompany = useDeleteCompany();

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

  const getFilterValue = (key: string) => searchParams.get(key) || '';

  const updateFilter = useCallback(
    (key: string, value: any, isMulti: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (isMulti) {
        params.delete(key);

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v && v !== 'all') {
              params.append(key, v);
            }
          });
        } else if (value && value !== 'all') {
          params.append(key, value);
        }
      } else {
        if (value && value !== 'all') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const onDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteCompany.mutateAsync(id);
      toast.success('Company deleted successfully');
      await refetch();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const columns: ColumnsType<ICompany> = [
    {
      title: 'Sl',
      key: 'index',
      fixed: 'left',
      width: '60px',
      render: (_, __, index) => (pageNo - 1) * pageSize + index + 1,
    },
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name',
      filterIcon: getFilterValue('companyName') ? <CheckCircle /> : <Search />,
      filterDropdown: (
        <TableFilterSearch
          onSearch={(value) => updateFilter('companyName', value)}
          placeholder='Search by name'
        />
      ),
      render: (text: string, record: ICompany) => (
        <div className='flex items-center space-x-3'>
          <div className='flex-shrink-0'>
            {record.logoUrl ? (
              <img
                src={record.logoUrl}
                alt={text}
                className='h-8 w-8 rounded border border-background-200 object-cover dark:border-background-dark-300'
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className='flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-semibold text-white'>
                {text.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className='font-medium text-heading dark:text-heading-dark'>
              {text}
            </div>
            <div className='text-sm text-paragraph dark:text-paragraph-dark'>
              {record.industry}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string) => (
        <a
          href={website}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary-500 hover:text-primary-600'
        >
          {website?.replace(/^https?:\/\//, '')?.substring(0, 20)}...
        </a>
      ),
    },
    {
      title: 'Actions',
      width: '150px',
      fixed: 'right',
      render: (record) => (
        <Space size='small'>
          <Button
            size='small'
            onClick={() => router.push(`/admin/companies/${record.id}`)}
            className='border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
          >
            View
          </Button>
          <ActionButton.Edit href={`/admin/companies/create/${record.id}`} />
          <ActionButton.Delete
            size='small'
            onClick={async () => await onDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-background-100 px-4 py-6 dark:bg-background-dark-100 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <Title
                level={2}
                className='mb-2 text-heading dark:text-heading-dark'
              >
                Companies
              </Title>
              <p className='text-paragraph dark:text-paragraph-dark'>
                Manage all registered companies for the job fair
              </p>
            </div>
            <Button
              type='primary'
              size='large'
              icon={<Plus className='h-4 w-4' />}
              onClick={() => router.push('/admin/companies/create')}
              className='h-12 border-primary-500 bg-primary-500 px-6 font-medium hover:border-primary-600 hover:bg-primary-600'
            >
              Add New Company
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className='mb-6 shadow-sm'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-row gap-2'>
              <TableTopButton text='Clear Filters' onClick={resetFilters} />
            </div>
            <div className='text-sm text-paragraph dark:text-paragraph-dark'>
              Total:{' '}
              <span className='font-semibold text-heading dark:text-heading-dark'>
                {data?.count || 0}
              </span>{' '}
              companies
            </div>
          </div>
        </Card>

        {isLoading ? (
          <LogoLoader />
        ) : (
          <div className=''>
            <Card className='shadow-sm'>
              <div className='overflow-x-auto'>
                <Table
                  scroll={{ x: true }}
                  columns={columns}
                  dataSource={data?.data}
                  rowKey={(record) => record.id!}
                  pagination={false}
                  loading={isLoading}
                  className='company-table'
                  size='middle'
                />
              </div>
            </Card>
            <div className='mt-6'>
              <AppPagination total={data?.count || 0} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
