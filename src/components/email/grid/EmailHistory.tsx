'use client';
import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Table, Tag, Space, Spin, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { IMailHistory } from '@/interfaces';
import { SentMailStatus } from '@/enums';
import { useGetAllMailHistory } from '@/apis';
import {
  ActionButton,
  AppPagination,
  TableFilterSearch,
  LogoLoader,
  TableBooleanFilter,
  TableEnumFilter,
} from '@/components/common';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { CheckCircle, Search } from 'lucide-react';

export const EmailHistory: React.FC = () => {
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

  const { data, isLoading } = useGetAllMailHistory(query);

  const statusColorMap: Record<SentMailStatus, string> = {
    [SentMailStatus.COMPLETED]: 'success',
    [SentMailStatus.SENT]: 'processing',
    [SentMailStatus.FAILED]: 'error',
    [SentMailStatus.CANCELLED]: 'warning',
    [SentMailStatus.DRAFT]: 'processing',
    [SentMailStatus.PAUSED]: 'processing',
    [SentMailStatus.QUEUED]: 'processing',
    [SentMailStatus.PROCESSING]: 'processing',
  };

  const getStatusColor = (status: SentMailStatus) => {
    return statusColorMap[status] ?? 'default';
  };

  useEffect(() => {
    const newQuery: any = {};

    newQuery.page = parseInt(searchParams.get('pageno') || '1', 10);
    newQuery.limit = parseInt(
      searchParams.get('pagesize') || DEFAULT_PAGE_SIZE,
      10
    );

    const filterKeys = [
      'recepitentEmail',
      'resourceName',
      'status',
      'sentTimes',
      'status',
      'isOpened',
    ];

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

  const columns: ColumnsType<IMailHistory> = [
    {
      title: 'Sl',
      key: 'index',
      fixed: 'left',
      width: '60px',
      render: (_, __, index) => (pageNo - 1) * pageSize + index + 1,
    },
    {
      title: 'Recipient',
      dataIndex: 'recepitentEmail',
      key: 'recepitentEmail',
      filterIcon: getFilterValue('recepitentEmail') ? (
        <CheckCircle />
      ) : (
        <Search />
      ),
      filterDropdown: (
        <TableFilterSearch
          onSearch={(value) => updateFilter('recepitentEmail', value)}
          placeholder='Search by email'
        />
      ),
    },
    {
      title: 'Resource',
      dataIndex: 'resourceName',
      key: 'resourceName',
      filterIcon: getFilterValue('resourceName') ? <CheckCircle /> : <Search />,
      filterDropdown: (
        <TableFilterSearch
          onSearch={(value) => updateFilter('resourceName', value)}
          placeholder='Search by resource'
        />
      ),
    },
    {
      title: 'Sent Times',
      dataIndex: 'sentTimes',
      key: 'sentTimes',
      render: (sentTimes) => {
        if (!sentTimes) return <span>Not sent</span>;
        if (sentTimes.length === 0) return <span>Not sent</span>;
        return <span>{dayjs(sentTimes).format('MMMM DD, YYYY HH:mm')}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filterIcon: getFilterValue('status') ? <CheckCircle /> : <Search />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <TableEnumFilter
          value={selectedKeys[0] ?? null}
          onChange={(value) => {
            setSelectedKeys(value ? [value] : []);
            confirm();
            updateFilter('status', `${value}`);
          }}
          enumObj={SentMailStatus}
        />
      ),
    },
    {
      title: 'Opened',
      dataIndex: 'isOpened',
      key: 'isOpened',
      render: (isOpened, record) => (
        <>
          {record.isPredefined ? (
            <Tag color={'pink'}>{'Not tracked'}</Tag>
          ) : (
            <Tag color={isOpened ? 'green' : 'red'}>
              {isOpened ? 'Opened' : 'Not opened'}
            </Tag>
          )}
        </>
      ),
      filterIcon: getFilterValue('isOpened') ? <CheckCircle /> : <Search />,
      filterDropdown: (
        <TableBooleanFilter
          onChange={(value) => updateFilter('isOpened', `${value}`)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      className: 'w-fit',
      render: (_, record) => (
        <Space>
          <ActionButton.Details
            href={`/admin/email-history/${record?.id}`}
            disabled={record.isPredefined}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className='mb-6 flex items-center gap-4'>
        <Button type='primary' onClick={resetFilters}>
          Reset Filter
        </Button>
      </div>

      {isLoading ? (
        <LogoLoader />
      ) : (
        <>
          <div className='mb-[55px] overflow-x-scroll'>
            <Table
              columns={columns}
              dataSource={data?.data}
              pagination={false}
              tableLayout='fixed'
              bordered
              loading={{
                indicator: <Spin />,
                spinning: isLoading,
              }}
              className='rounded-md border'
            />
          </div>
          <AppPagination total={data?.count || 0} />
        </>
      )}
    </div>
  );
};
