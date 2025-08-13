'use client';
import React, { useState } from 'react';
import {
  Button,
  Card,
  Table,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Avatar,
} from 'antd';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Eye,
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
import { AppPagination } from '@/components/common';
import dayjs from 'dayjs';

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
}

export const WebinarList: React.FC<WebinarListViewProps> = ({
  webinars,
  totalCount,
  isLoading,
  searchParams,
}) => {
  const router = useRouter();
  const [searchTitle, setSearchTitle] = useState(searchParams.title);

  const getStatusColor = (status: WebinarStatus) => {
    switch (status) {
      case WebinarStatus.SCHEDULED:
        return '#1890ff';
      case WebinarStatus.LIVE:
        return '#52c41a';
      case WebinarStatus.COMPLETED:
        return '#722ed1';
      case WebinarStatus.CANCELLED:
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusIcon = (status: WebinarStatus) => {
    switch (status) {
      case WebinarStatus.SCHEDULED:
        return <Calendar className='h-3 w-3' />;
      case WebinarStatus.LIVE:
        return <Play className='h-3 w-3' />;
      case WebinarStatus.COMPLETED:
        return <CheckCircle className='h-3 w-3' />;
      case WebinarStatus.CANCELLED:
        return <XCircle className='h-3 w-3' />;
      default:
        return <Pause className='h-3 w-3' />;
    }
  };

  const formatDateTime = (date: string | Date) => {
    return dayjs(date).format('MMM DD, YYYY HH:mm');
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
              {record.description}
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
              {record.host?.companyName || 'Unknown Host'}
            </span>
          </div>
          <div className='mb-1 flex items-center gap-1'>
            <Calendar className='h-3 w-3' style={{ color: '#52c41a' }} />
            <span className='text-xs' style={{ color: '#9CA3AF' }}>
              {record.timeslot?.timeslotName || 'No timeslot'}
            </span>
          </div>
          {record.scheduledStartTime && (
            <div className='text-xs' style={{ color: '#9CA3AF' }}>
              {formatDateTime(record.scheduledStartTime)}
            </div>
          )}
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
      render: (record: IWebinar) => (
        <div className='flex items-center gap-2'>
          <Tag
            icon={getStatusIcon(record.status)}
            style={{
              backgroundColor: `${getStatusColor(record.status)}20`,
              color: getStatusColor(record.status),
              border: 'none',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      fixed: 'right' as const,
      render: (record: IWebinar) => (
        <Space size='small'>
          <Button
            type='link'
            size='small'
            icon={<Eye className='h-4 w-4' />}
            className='p-1 text-blue-600 hover:text-blue-800'
            onClick={() => router.push(`/admin/webinars/${record.id}`)}
          />
          <Button
            type='link'
            size='small'
            icon={<Edit className='h-4 w-4' />}
            className='p-1 text-green-600 hover:text-green-800'
            onClick={() => router.push(`/admin/webinars/edit/${record.id}`)}
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

  const getWebinarStats = () => {
    const scheduled = webinars.filter(
      (w) => w.status === WebinarStatus.SCHEDULED
    ).length;
    const live = webinars.filter((w) => w.status === WebinarStatus.LIVE).length;
    const completed = webinars.filter(
      (w) => w.status === WebinarStatus.COMPLETED
    ).length;
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
            <h1 className='text-3xl font-bold text-heading dark:text-white'>
              Webinar Management
            </h1>
            <p className='mt-2 text-paragraph dark:text-gray-200'>
              Manage webinars, schedules, and participant engagement
            </p>
          </div>
          <Button
            type='primary'
            icon={<Plus className='h-4 w-4' />}
            onClick={() => router.push('/admin/webinars/create')}
            className='h-10 border-primary bg-primary font-medium hover:bg-primary-600'
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

        {/* Filters */}
        <Card
          className='mb-6 border-0 shadow-lg'
          style={{ backgroundColor: '#2a2a2a' }}
        >
          <Row gutter={16} align='middle'>
            <Col xs={24} sm={8}>
              <Input
                placeholder='Search webinars...'
                prefix={<Search className='h-4 w-4 text-gray-400' />}
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className='h-10 border-gray-600 bg-gray-800 text-white placeholder:text-gray-400'
                onPressEnter={() => {
                  // Handle search
                }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder='Filter by status'
                className='h-10 w-full'
                allowClear
                suffixIcon={<Filter className='h-4 w-4 text-gray-400' />}
              >
                <Select.Option value={WebinarStatus.SCHEDULED}>
                  Scheduled
                </Select.Option>
                <Select.Option value={WebinarStatus.LIVE}>Live</Select.Option>
                <Select.Option value={WebinarStatus.COMPLETED}>
                  Completed
                </Select.Option>
                <Select.Option value={WebinarStatus.CANCELLED}>
                  Cancelled
                </Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder='Filter by host'
                className='h-10 w-full'
                allowClear
                suffixIcon={<Users className='h-4 w-4 text-gray-400' />}
              >
                {/* Load company options here */}
              </Select>
            </Col>
            <Col xs={24} sm={4}>
              <Button
                type='primary'
                icon={<Search className='h-4 w-4' />}
                className='h-10 w-full border-primary bg-primary hover:bg-primary-600'
              >
                Search
              </Button>
            </Col>
          </Row>
        </Card>

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
            rowKey='id'
            scroll={{ x: 1000 }}
            className='custom-table'
            style={{
              backgroundColor: 'transparent',
            }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onRow={(record) => ({
              style: {
                backgroundColor: '#2a2a2a',
                borderBottom: '1px solid #3a3a3a',
              },
            })}
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
