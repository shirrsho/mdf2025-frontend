'use client';
import React, { useMemo } from 'react';
import { Button, Card, Table, Space } from 'antd';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Clock,
  Calendar as CalendarIcon,
  Users,
  Edit,
  Trash2,
  Grid,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { ITimeslot } from '@/interfaces';
import { AppPagination } from '@/components/common';
import { useGetAllWebinars } from '@/apis';
import dayjs from 'dayjs';

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
  const { data: webinarsData } = useGetAllWebinars({ limit: 1000 }); // Fetch all webinars

  // Create a map of timeslot ID to webinar count for efficient lookup
  const timeslotWebinarMap = useMemo(() => {
    if (!webinarsData?.data) return {};

    const map: Record<string, number> = {};
    webinarsData.data.forEach((webinar) => {
      const timeslotId = webinar.timeslotId || webinar.timeslot?.id;
      if (timeslotId) {
        map[timeslotId] = (map[timeslotId] || 0) + 1;
      }
    });
    return map;
  }, [webinarsData]);

  const formatTime = (date: string | Date) => {
    return dayjs(date).format('MMM DD, YYYY - hh:mm A');
  };

  const formatDuration = (startTime: string | Date, endTime: string | Date) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const duration = end.diff(start, 'minutes');
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

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
          <div className='mb-2 flex items-center gap-2'>
            <CalendarIcon className='h-3 w-3' style={{ color: '#AFADB5' }} />
            <span className='text-sm font-medium' style={{ color: '#F9FAFB' }}>
              Start: {formatTime(record.startTime)}
            </span>
          </div>
          <div className='mb-2 flex items-center gap-2'>
            <Clock className='h-3 w-3' style={{ color: '#AFADB5' }} />
            <span className='text-sm font-medium' style={{ color: '#F9FAFB' }}>
              End: {formatTime(record.endTime)}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='h-3 w-3' style={{ color: '#bfab25' }} />
            <span className='text-sm' style={{ color: '#bfab25' }}>
              Duration: {formatDuration(record.startTime, record.endTime)}
            </span>
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
        const isTimeslotPast = dayjs(record.endTime).isBefore(dayjs());

        return (
          <div>
            <div className='mb-1 flex items-center gap-1'>
              <Users
                className='h-3 w-3'
                style={{ color: webinarCount > 0 ? '#10b981' : '#6b7280' }}
              />
              <span
                className='text-sm font-medium'
                style={{ color: '#F9FAFB' }}
              >
                {webinarCount} Webinar{webinarCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div
              className='text-xs'
              style={{
                color: isTimeslotPast
                  ? '#ef4444'
                  : webinarCount > 0
                    ? '#10b981'
                    : '#f59e0b',
              }}
            >
              {isTimeslotPast
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
          {createdAt ? dayjs(createdAt).format('MMM DD, YYYY') : 'N/A'}
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
          {/* <Button
            type="link"
            size="small"
            icon={<Eye className="h-4 w-4" />}
            className="text-blue-600 hover:text-blue-800 p-1"
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete
            }}
          /> */}
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

  const upcomingTimeslots = timeslots.filter((t) =>
    dayjs(t.startTime).isAfter(dayjs())
  );

  const totalWebinars = webinarsData?.data?.length || 0;

  return (
    <div className='min-h-screen bg-background-100 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-7xl rounded-md p-6'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-heading dark:text-white'>
              Timeslot Management
            </h1>
            <p className='mt-1 text-paragraph dark:text-gray-200'>
              Manage time slots for webinar scheduling
            </p>
          </div>
          <Space>
            <Button
              size='large'
              icon={<Grid className='h-4 w-4' />}
              onClick={() => router.push(`${getBaseUrl()}/timeslots/overview`)}
              className='h-12 border-indigo-600 px-6 font-medium text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-500 dark:border-indigo-400 dark:text-indigo-400 dark:hover:border-indigo-300 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-300'
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
          </Space>
        </div>

        {/* Stats Cards */}
        <div className='mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#F4612E20' }}
              >
                <Clock className='h-6 w-6' style={{ color: '#F4612E' }} />
              </div>
              <div>
                <p className='text-sm font-medium' style={{ color: '#AFADB5' }}>
                  Total Timeslots
                </p>
                <p className='text-2xl font-bold' style={{ color: '#F9FAFB' }}>
                  {totalCount || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#10b98120' }}
              >
                <Users className='h-6 w-6' style={{ color: '#10b981' }} />
              </div>
              <div>
                <p className='text-sm font-medium' style={{ color: '#AFADB5' }}>
                  Total Webinars
                </p>
                <p className='text-2xl font-bold' style={{ color: '#F9FAFB' }}>
                  {totalWebinars}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#f59e0b20' }}
              >
                <Grid className='h-6 w-6' style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <p className='text-sm font-medium' style={{ color: '#AFADB5' }}>
                  Past Timeslots
                </p>
                <p className='text-2xl font-bold' style={{ color: '#F9FAFB' }}>
                  {
                    timeslots.filter((t) => dayjs(t.endTime).isBefore(dayjs()))
                      .length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#bfab2520' }}
              >
                <CalendarIcon
                  className='h-6 w-6'
                  style={{ color: '#bfab25' }}
                />
              </div>
              <div>
                <p className='text-sm font-medium' style={{ color: '#AFADB5' }}>
                  Upcoming
                </p>
                <p className='text-2xl font-bold' style={{ color: '#F9FAFB' }}>
                  {upcomingTimeslots.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

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
