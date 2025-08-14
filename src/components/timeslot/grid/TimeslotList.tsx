'use client';
import React, { useMemo } from 'react';
import { Button, Card, Table, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Grid } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { ITimeslot } from '@/interfaces';
import { AppPagination } from '@/components/common';
import { useGetAllWebinars } from '@/apis';
import {
  useTimeslotUtils,
  useTimeslotStats,
  TimeslotStatsCards,
  TimeslotPageHeader,
} from '../shared';

interface TimeslotListViewProps {
  timeslots: ITimeslot[];
  totalCount: number;
  isLoading: boolean;
  searchParams: {
    page: number;
    limit: number;
    timeslotName: string;
  };
  onTableChange: (pagination: any) => void;
  mode: 'admin';
}

export const TimeslotList: React.FC<TimeslotListViewProps> = ({
  timeslots,
  totalCount,
  isLoading,
  onTableChange,
  mode,
}) => {
  const router = useRouter();

  // Fetch all webinars to calculate usage statistics
  const { data: webinarsData } = useGetAllWebinars({ limit: 1000 });
  const webinars = useMemo(
    () => webinarsData?.data || [],
    [webinarsData?.data]
  );

  const { formatFullDateTime, formatDuration } = useTimeslotUtils();
  const stats = useTimeslotStats({ timeslots, webinars });

  // Create a map of timeslot ID to webinar count for efficient lookup
  const timeslotWebinarMap = useMemo(() => {
    if (!webinars.length) return {};

    const map: Record<string, number> = {};
    webinars.forEach((webinar) => {
      const timeslotId = webinar.timeslotId || webinar.timeslot?.id;
      if (timeslotId) {
        map[timeslotId] = (map[timeslotId] || 0) + 1;
      }
    });
    return map;
  }, [webinars]);

  const getBaseUrl = () => {
    return mode === 'admin' ? '/admin' : '/c';
  };

  const columns: ColumnsType<ITimeslot> = [
    {
      title: 'Timeslot Details',
      dataIndex: 'timeslotName',
      key: 'timeslotName',
      width: '25%',
      render: (timeslotName: string, record: ITimeslot) => (
        <div>
          <div
            className='mb-1 text-base font-semibold'
            style={{ color: '#F9FAFB' }}
          >
            {timeslotName}
          </div>
          {record.description && (
            <div className='text-sm' style={{ color: '#D1D5DB' }}>
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Schedule',
      key: 'schedule',
      width: '30%',
      render: (record: ITimeslot) => (
        <div>
          <div
            className='mb-2 text-sm font-medium'
            style={{ color: '#F9FAFB' }}
          >
            Start: {formatFullDateTime(record.startTime)}
          </div>
          <div
            className='mb-2 text-sm font-medium'
            style={{ color: '#F9FAFB' }}
          >
            End: {formatFullDateTime(record.endTime)}
          </div>
          <div className='text-sm' style={{ color: '#bfab25' }}>
            Duration: {formatDuration(record.startTime, record.endTime)}
          </div>
        </div>
      ),
    },
    {
      title: 'Usage',
      key: 'usage',
      width: '15%',
      render: (record: ITimeslot) => {
        const webinarCount = timeslotWebinarMap[record.id!] || 0;
        const isPast = new Date(record.endTime) < new Date();

        return (
          <div>
            <div
              className='mb-1 text-sm font-medium'
              style={{ color: '#F9FAFB' }}
            >
              {webinarCount} Webinar{webinarCount !== 1 ? 's' : ''}
            </div>
            <div
              className='text-xs'
              style={{
                color: isPast
                  ? '#ef4444'
                  : webinarCount > 0
                    ? '#10b981'
                    : '#f59e0b',
              }}
            >
              {isPast
                ? 'Past'
                : webinarCount > 0
                  ? `${webinarCount} Scheduled`
                  : 'Available'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (createdAt: string) => (
        <div className='text-sm' style={{ color: '#D1D5DB' }}>
          {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (record: ITimeslot) => (
        <Space size='small'>
          <Button
            type='link'
            size='small'
            icon={<Edit className='h-4 w-4' />}
            className='p-1 text-green-600 hover:text-green-800'
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/timeslots/create/${record?.id}`);
            }}
          />
          <Button
            type='link'
            size='small'
            icon={<Trash2 className='h-4 w-4' />}
            className='p-1 text-red-600 hover:text-red-800'
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete
            }}
          />
        </Space>
      ),
    },
  ];

  const headerActions = (
    <>
      <Button
        size='large'
        icon={<Grid className='h-4 w-4' />}
        onClick={() => router.push(`${getBaseUrl()}/timeslots/overview`)}
        className='h-12 border-indigo-400 px-6 font-medium text-indigo-400 hover:border-indigo-300 hover:bg-indigo-900/20 hover:text-indigo-300'
      >
        📊 View All Slots
      </Button>
      <Button
        type='primary'
        size='large'
        icon={<Plus className='h-4 w-4' />}
        onClick={() => router.push(`${getBaseUrl()}/timeslots/create`)}
        className='h-12 border-primary bg-primary px-6 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
      >
        Create New Timeslot
      </Button>
    </>
  );

  return (
    <div className='min-h-screen bg-background-100 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-7xl rounded-md p-6'>
        {/* Header */}
        <TimeslotPageHeader
          title='Timeslot Management'
          subtitle='Manage time slots for webinar scheduling'
          showBackButton={false}
          actions={headerActions}
        />

        {/* Stats Cards */}
        <TimeslotStatsCards stats={stats} />

        {/* Content - Table */}
        <Card
          className='border-0 shadow-lg'
          style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
        >
          <Table
            columns={columns}
            dataSource={timeslots}
            rowKey={(record) => record.id!}
            onRow={(record) => ({
              onClick: () =>
                router.push(`${getBaseUrl()}/timeslots/${record.id}`),
            })}
            pagination={false}
            loading={isLoading}
            onChange={onTableChange}
            size='middle'
            rowClassName={'!cursor-pointer'}
          />
        </Card>

        <div className='mt-6'>
          <AppPagination total={totalCount || 0} />
        </div>
      </div>
    </div>
  );
};
