'use client';
import React from 'react';
import {
  Button,
  Card,
  Table,
  Tag,
  Space,
  Row,
  Col,
  Statistic,
  Avatar,
  Tooltip,
  Modal,
  notification,
} from 'antd';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  Link,
  Play,
  CheckCircle,
  XCircle,
  Pause,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { IWebinar, WebinarStatus } from '@/interfaces';
import { AppPagination, HtmlRenderer } from '@/components/common';
import { handleErrorToast } from '@/utils';
import {
  getWebinarDisplayStatus,
  isWebinarLive,
  isWebinarCompleted,
  isWebinarScheduled,
} from '@/utils/webinar.utils';
import dayjs from 'dayjs';

const { confirm } = Modal;

interface WebinarListViewProps {
  webinars: IWebinar[];
  totalCount: number;
  isLoading: boolean;
  searchParams: {
    title?: string;
    status?: string;
    hostId?: string;
    page?: number;
    limit?: number;
  };
  onTableChange?: (pagination: any) => void;
  onDelete?: (webinar: IWebinar) => Promise<void>;
  mode?: 'admin' | 'company';
}

export const WebinarList: React.FC<WebinarListViewProps> = ({
  webinars,
  totalCount,
  isLoading,
  searchParams, // eslint-disable-line @typescript-eslint/no-unused-vars
  onTableChange,
  onDelete,
  mode = 'admin', // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const router = useRouter();

  const handleDelete = (webinar: IWebinar) => {
    confirm({
      title: 'Delete Webinar',
      content: `Are you sure you want to delete "${webinar.title}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await onDelete?.(webinar);
          notification.success({
            message: 'Success',
            description: 'Webinar deleted successfully!',
            placement: 'topRight',
          });
        } catch (error) {
          handleErrorToast(error);
        }
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Calendar className='h-3 w-3' />;
      case 'live':
        return <Play className='h-3 w-3' />;
      case 'completed':
        return <CheckCircle className='h-3 w-3' />;
      case 'cancelled':
        return <XCircle className='h-3 w-3' />;
      default:
        return <Pause className='h-3 w-3' />;
    }
  };

  const getDurationText = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const columns: ColumnsType<IWebinar> = [
    {
      title: 'Webinar Details',
      key: 'details',
      width: '30%',
      render: (record: IWebinar) => (
        <div className='flex items-start gap-3'>
          <Avatar
            size={48}
            src={record.bannerUrl}
            style={{ backgroundColor: '#1890ff', flexShrink: 0 }}
          >
            {record.title.charAt(0).toUpperCase()}
          </Avatar>
          <div className='min-w-0 flex-1'>
            <div
              className='cursor-pointer truncate text-sm font-medium hover:text-blue-500'
              style={{ color: '#F9FAFB' }}
              onClick={() => router.push(`/admin/webinars/${record.id}`)}
            >
              {record.title}
            </div>
            <div className='mt-1 line-clamp-2 text-xs text-gray-400'>
              <HtmlRenderer htmlString={record.description} />
            </div>
            {record.category && (
              <Tag
                className='mt-1'
                style={{
                  backgroundColor: '#1890ff20',
                  color: '#1890ff',
                  border: 'none',
                  fontSize: '10px',
                }}
              >
                {record.category}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Host & Schedule',
      key: 'host_schedule',
      width: '25%',
      render: (record: IWebinar) => (
        <div>
          <div className='mb-2 flex items-center gap-1'>
            <Users className='h-3 w-3' style={{ color: '#1890ff' }} />
            <span className='text-xs font-medium' style={{ color: '#F9FAFB' }}>
              {record.host?.name || 'Unknown Host'}
            </span>
          </div>
          <div className='mb-1 flex items-center gap-1'>
            <Calendar className='h-3 w-3' style={{ color: '#52c41a' }} />
            <span className='text-xs' style={{ color: '#9CA3AF' }}>
              {record.timeslot?.timeslotName || 'No timeslot'}
            </span>
          </div>
          <div className='text-xs' style={{ color: '#9CA3AF' }}>
            {/* {formatWebinarTime(record)} */}
            {dayjs(record?.scheduledStartTime?.toString()).format(
              'h:mmA'
            )} -{' '}
            {dayjs(record?.scheduledStartTime?.toString())
              .add(record.duration, 'minute')
              .format('h:mmA')}
          </div>
        </div>
      ),
    },
    {
      title: 'Details',
      key: 'details_info',
      width: '20%',
      render: (record: IWebinar) => (
        <div>
          <div className='mb-1 flex items-center gap-1'>
            <Clock className='h-3 w-3' style={{ color: '#f59e0b' }} />
            <span className='text-xs' style={{ color: '#F9FAFB' }}>
              {getDurationText(record.duration)}
            </span>
          </div>
          {record.maxParticipants && (
            <div className='mb-1 flex items-center gap-1'>
              <Users className='h-3 w-3' style={{ color: '#10b981' }} />
              <span className='text-xs' style={{ color: '#9CA3AF' }}>
                Max: {record.maxParticipants}
              </span>
            </div>
          )}
          {record.meetingLink && (
            <div className='flex items-center gap-1'>
              <Link className='h-3 w-3' style={{ color: '#8b5cf6' }} />
              <span className='truncate text-xs text-blue-400'>
                Meeting Link
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: '15%',
      render: (record: IWebinar) => {
        const displayStatus = getWebinarDisplayStatus(record);

        return (
          <div className='flex items-center gap-2'>
            <Tag
              icon={getStatusIcon(displayStatus.status)}
              style={{
                backgroundColor: `${displayStatus.color}20`,
                color: displayStatus.color,
                border: 'none',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {displayStatus.label}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      fixed: 'right' as const,
      render: (record: IWebinar) => (
        <Space size='small'>
          <Tooltip title='Edit Webinar'>
            <Button
              size='small'
              icon={<Edit className='h-3 w-3' />}
              style={{
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                color: 'white',
              }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/webinars/create/${record.id}`);
              }}
            />
          </Tooltip>
          {onDelete && (
            <Tooltip title='Delete Webinar'>
              <Button
                size='small'
                icon={<Trash2 className='h-3 w-3' />}
                style={{
                  backgroundColor: '#ef4444',
                  borderColor: '#ef4444',
                  color: 'white',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(record);
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const getWebinarStats = () => {
    const scheduled = webinars.filter((w) => isWebinarScheduled(w)).length;
    const live = webinars.filter((w) => isWebinarLive(w)).length;
    const completed = webinars.filter((w) => isWebinarCompleted(w)).length;
    const cancelled = webinars.filter(
      (w) => w.status === WebinarStatus.CANCELLED
    ).length;

    return { scheduled, live, completed, cancelled };
  };

  const stats = getWebinarStats();

  return (
    <div className='min-h-screen bg-background-100 p-6 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-heading dark:text-white'>
              Webinar Management
            </h1>
            <p className='mt-1 text-paragraph dark:text-gray-200'>
              Manage webinars, schedules, and participant engagement
            </p>
          </div>
          <Button
            type='primary'
            size='large'
            icon={<Plus className='h-4 w-4' />}
            onClick={() => router.push('/admin/webinars/create')}
            className='h-12 border-primary bg-primary px-6 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
          >
            Create Webinar
          </Button>
        </div>

        {/* Stats Cards */}
        <Row gutter={16} className='mb-6'>
          <Col xs={12} sm={6}>
            <Card
              className='border-0 shadow-sm'
              style={{ backgroundColor: '#1890ff20' }}
            >
              <Statistic
                title={<span className='text-blue-600'>Scheduled</span>}
                value={stats.scheduled}
                prefix={<Calendar className='h-4 w-4 text-blue-600' />}
                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              className='border-0 shadow-sm'
              style={{ backgroundColor: '#52c41a20' }}
            >
              <Statistic
                title={<span className='text-green-600'>Live</span>}
                value={stats.live}
                prefix={<Play className='h-4 w-4 text-green-600' />}
                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              className='border-0 shadow-sm'
              style={{ backgroundColor: '#722ed120' }}
            >
              <Statistic
                title={<span className='text-purple-600'>Completed</span>}
                value={stats.completed}
                prefix={<CheckCircle className='h-4 w-4 text-purple-600' />}
                valueStyle={{ color: '#722ed1', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              className='border-0 shadow-sm'
              style={{ backgroundColor: '#ff4d4f20' }}
            >
              <Statistic
                title={<span className='text-red-600'>Cancelled</span>}
                value={stats.cancelled}
                prefix={<XCircle className='h-4 w-4 text-red-600' />}
                valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Webinar Table */}
        <Card
          className='border-0 shadow-lg'
          style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            columns={columns}
            dataSource={webinars}
            loading={isLoading}
            pagination={false}
            rowKey={(record) => record.id!}
            onChange={onTableChange}
            onRow={(record) => ({
              onClick: () => router.push(`/admin/webinars/${record.id}`),
            })}
            scroll={{ x: 1000 }}
            rowClassName={'!cursor-pointer'}
          />

          {/* Pagination */}
          <div className='border-t border-gray-600 px-6 py-4'>
            <AppPagination total={totalCount} />
          </div>
        </Card>
      </div>
    </div>
  );
};
