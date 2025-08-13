'use client';
import React from 'react';
import {
  Card,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Typography,
  Descriptions,
} from 'antd';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  Edit,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useGetTimeslotById } from '@/apis';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { Title, Text } = Typography;

interface TimeslotDetailProps {
  timeslotId: string;
}

export const TimeslotDetail: React.FC<TimeslotDetailProps> = ({
  timeslotId,
}) => {
  const router = useRouter();
  const { data: timeslot, isLoading } = useGetTimeslotById(timeslotId);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading timeslot details...
        </div>
      </div>
    );
  }

  if (!timeslot) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Timeslot not found
        </div>
      </div>
    );
  }

  const formatDateTime = (date: string | Date) => {
    return dayjs(date).format('MMMM DD, YYYY - hh:mm A');
  };

  const calculateDuration = () => {
    const start = dayjs(timeslot.startTime);
    const end = dayjs(timeslot.endTime);
    const duration = end.diff(start, 'minutes');
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? '#10b981' : '#ef4444';
  };

  const isUpcoming = dayjs(timeslot.startTime).isAfter(dayjs());
  const isActive = dayjs().isBetween(
    dayjs(timeslot.startTime),
    dayjs(timeslot.endTime)
  );

  return (
    <div className='min-h-screen bg-background-100 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-6xl p-6'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              icon={<ArrowLeft className='h-4 w-4' />}
              onClick={() => router.back()}
              className='h-10 border-gray-300 text-paragraph dark:border-gray-600 dark:text-paragraph-dark'
            >
              Back
            </Button>
            <div>
              <Title level={2} className='!mb-1 !text-heading dark:!text-white'>
                {timeslot.timeslotName}
              </Title>
              <Text className='text-paragraph dark:text-gray-200'>
                Timeslot Details & Management
              </Text>
            </div>
          </div>
          <Space>
            <Button
              type='primary'
              icon={<Edit className='h-4 w-4' />}
              onClick={() =>
                router.push(`/admin/timeslots/create/${timeslot.id}`)
              }
              className='h-10 border-primary bg-primary font-medium hover:bg-primary-600'
            >
              Edit Timeslot
            </Button>
          </Space>
        </div>

        {/* Status Banner */}
        <Card
          className='mb-6 border-0'
          style={{
            backgroundColor: isActive
              ? '#10b98120'
              : isUpcoming
                ? '#f59e0b20'
                : '#ef444420',
            borderRadius: '12px',
          }}
        >
          <div className='flex items-center gap-3'>
            {isActive ? (
              <CheckCircle className='h-5 w-5 text-green-500' />
            ) : isUpcoming ? (
              <Clock className='h-5 w-5 text-yellow-500' />
            ) : (
              <XCircle className='h-5 w-5 text-red-500' />
            )}
            <div>
              <Text
                className='font-medium'
                style={{
                  color: isActive
                    ? '#10b981'
                    : isUpcoming
                      ? '#f59e0b'
                      : '#ef4444',
                }}
              >
                {isActive
                  ? 'Currently Active'
                  : isUpcoming
                    ? 'Upcoming'
                    : 'Past'}
              </Text>
              <div className='text-sm' style={{ color: '#6b7280' }}>
                {isActive
                  ? 'This timeslot is currently running'
                  : isUpcoming
                    ? 'Scheduled for the future'
                    : 'This timeslot has ended'}
              </div>
            </div>
          </div>
        </Card>

        <Row gutter={24}>
          {/* Left Column - Details */}
          <Col xs={24} lg={16}>
            {/* Basic Information */}
            <Card
              title={
                <span className='text-lg font-medium text-gray-200'>
                  Timeslot Information
                </span>
              }
              className='mb-6 border-0 shadow-lg'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <Descriptions
                column={1}
                labelStyle={{ color: '#9ca3af', fontWeight: '500' }}
                contentStyle={{ color: '#f9fafb' }}
              >
                <Descriptions.Item label='Name'>
                  {timeslot.timeslotName}
                </Descriptions.Item>
                <Descriptions.Item label='Description'>
                  {timeslot.description || 'No description provided'}
                </Descriptions.Item>
                <Descriptions.Item label='Status'>
                  <Tag
                    style={{
                      backgroundColor: `${getStatusColor(timeslot.isAvailable)}20`,
                      color: getStatusColor(timeslot.isAvailable),
                      border: 'none',
                      fontSize: '12px',
                    }}
                  >
                    {timeslot.isAvailable ? 'Available' : 'Unavailable'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Slug'>
                  <code className='rounded bg-gray-700 px-2 py-1 text-sm text-gray-300'>
                    {timeslot.slug}
                  </code>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Schedule Information */}
            <Card
              title={
                <span className='flex items-center gap-2 text-lg font-medium text-gray-200'>
                  <Calendar className='h-5 w-5' />
                  Schedule Details
                </span>
              }
              className='mb-6 border-0 shadow-lg'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <div className='mb-4'>
                    <Text className='mb-2 block text-sm font-medium text-gray-400'>
                      Start Time
                    </Text>
                    <div className='flex items-center gap-2 text-gray-200'>
                      <Calendar className='h-4 w-4 text-blue-400' />
                      <span>{formatDateTime(timeslot.startTime)}</span>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className='mb-4'>
                    <Text className='mb-2 block text-sm font-medium text-gray-400'>
                      End Time
                    </Text>
                    <div className='flex items-center gap-2 text-gray-200'>
                      <Calendar className='h-4 w-4 text-red-400' />
                      <span>{formatDateTime(timeslot.endTime)}</span>
                    </div>
                  </div>
                </Col>
                <Col xs={24}>
                  <div>
                    <Text className='mb-2 block text-sm font-medium text-gray-400'>
                      Duration
                    </Text>
                    <div className='flex items-center gap-2 text-gray-200'>
                      <Clock className='h-4 w-4 text-yellow-400' />
                      <span className='font-medium'>{calculateDuration()}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Webinars in this Timeslot */}
            <Card
              title={
                <span className='flex items-center gap-2 text-lg font-medium text-gray-200'>
                  <Users className='h-5 w-5' />
                  Scheduled Webinars
                </span>
              }
              className='border-0 shadow-lg'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <div className='py-8 text-center'>
                <Users className='mx-auto mb-4 h-12 w-12 text-gray-500' />
                <Text className='text-gray-400'>
                  No webinars scheduled for this timeslot yet
                </Text>
                <div className='mt-4'>
                  <Button
                    type='primary'
                    onClick={() =>
                      router.push(
                        `/admin/webinars/create?timeslot=${timeslot.id}`
                      )
                    }
                    className='border-primary bg-primary hover:bg-primary-600'
                  >
                    Schedule Webinar
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column - Statistics */}
          <Col xs={24} lg={8}>
            {/* Quick Stats */}
            <Card
              title={
                <span className='text-lg font-medium text-gray-200'>
                  Quick Statistics
                </span>
              }
              className='mb-6 border-0 shadow-lg'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <Row gutter={[16, 24]}>
                <Col span={24}>
                  <Statistic
                    title={
                      <span className='text-gray-400'>Total Webinars</span>
                    }
                    value={0}
                    valueStyle={{ color: '#f9fafb' }}
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title={
                      <span className='text-gray-400'>Available Time</span>
                    }
                    value={calculateDuration()}
                    valueStyle={{ color: '#f9fafb' }}
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title={<span className='text-gray-400'>Capacity Used</span>}
                    value={0}
                    suffix='%'
                    valueStyle={{ color: '#10b981' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Actions */}
            <Card
              title={
                <span className='text-lg font-medium text-gray-200'>
                  Quick Actions
                </span>
              }
              className='border-0 shadow-lg'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <Space direction='vertical' className='w-full'>
                <Button
                  block
                  type='primary'
                  icon={<Users className='h-4 w-4' />}
                  onClick={() =>
                    router.push(
                      `/admin/webinars/create?timeslot=${timeslot.id}`
                    )
                  }
                  className='h-10 border-primary bg-primary hover:bg-primary-600'
                >
                  Schedule New Webinar
                </Button>
                <Button
                  block
                  icon={<Edit className='h-4 w-4' />}
                  onClick={() =>
                    router.push(`/admin/timeslots/create/${timeslot.id}`)
                  }
                  className='h-10 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                >
                  Edit Timeslot
                </Button>
                <Button
                  block
                  icon={<Calendar className='h-4 w-4' />}
                  onClick={() => router.push('/admin/timeslots')}
                  className='h-10 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                >
                  View All Timeslots
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
