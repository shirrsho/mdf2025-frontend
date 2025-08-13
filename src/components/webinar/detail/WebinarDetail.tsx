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
  Avatar,
} from 'antd';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  Edit,
  Link,
  Play,
  CheckCircle,
  XCircle,
  Pause,
  Building,
  Globe,
  User,
} from 'lucide-react';
import { useGetWebinarById } from '@/apis';
import { WebinarStatus } from '@/interfaces';
import dayjs from 'dayjs';
import { HtmlRenderer } from '@/components/common';

const { Title, Text } = Typography;

interface WebinarDetailProps {
  webinarId: string;
}

export const WebinarDetail: React.FC<WebinarDetailProps> = ({ webinarId }) => {
  const router = useRouter();
  const { data: webinar, isLoading } = useGetWebinarById(webinarId);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading webinar details...
        </div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Webinar not found
        </div>
      </div>
    );
  }

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
        return <Calendar className='h-5 w-5' />;
      case WebinarStatus.LIVE:
        return <Play className='h-5 w-5' />;
      case WebinarStatus.COMPLETED:
        return <CheckCircle className='h-5 w-5' />;
      case WebinarStatus.CANCELLED:
        return <XCircle className='h-5 w-5' />;
      default:
        return <Pause className='h-5 w-5' />;
    }
  };

  const formatDateTime = (date: string | Date) => {
    return dayjs(date).format('MMMM DD, YYYY - hh:mm A');
  };

  const getDurationText = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} minutes` : ''}`;
    }
    return `${mins} minutes`;
  };

  const isUpcoming = webinar.status === WebinarStatus.SCHEDULED;
  const isLive = webinar.status === WebinarStatus.LIVE;
  const isCompleted = webinar.status === WebinarStatus.COMPLETED;

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
                {webinar.title}
              </Title>
              <Text className='text-paragraph dark:text-gray-200'>
                Webinar Details & Management
              </Text>
            </div>
          </div>
          <Space>
            <Button
              type='primary'
              icon={<Edit className='h-4 w-4' />}
              onClick={() =>
                router.push(`/admin/webinars/create/${webinar.id}`)
              }
              className='h-10 border-primary bg-primary font-medium hover:bg-primary-600'
            >
              Edit Webinar
            </Button>
          </Space>
        </div>

        {/* Status Banner */}
        <Card
          className='mb-6 border-0'
          style={{
            backgroundColor: isLive
              ? '#52c41a20'
              : isUpcoming
                ? '#1890ff20'
                : isCompleted
                  ? '#722ed120'
                  : '#ff4d4f20',
            borderRadius: '12px',
          }}
        >
          <div className='flex items-center gap-3'>
            {getStatusIcon(webinar.status)}
            <div>
              <Text
                className='font-medium'
                style={{
                  color: getStatusColor(webinar.status),
                }}
              >
                {webinar.status.charAt(0).toUpperCase() +
                  webinar.status.slice(1)}
              </Text>
              <div className='text-sm' style={{ color: '#6b7280' }}>
                {isLive
                  ? 'This webinar is currently live'
                  : isUpcoming
                    ? 'Scheduled for the future'
                    : isCompleted
                      ? 'This webinar has been completed'
                      : 'This webinar has been cancelled'}
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
                  Webinar Information
                </span>
              }
              className='mb-6 border-0 shadow-lg'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <div className='mb-6 flex items-start gap-4'>
                <Avatar
                  size={80}
                  src={webinar.bannerUrl}
                  style={{ backgroundColor: '#1890ff', flexShrink: 0 }}
                >
                  {webinar.title.charAt(0).toUpperCase()}
                </Avatar>
                <div className='flex-1'>
                  <Title level={4} className='!mb-2 !text-gray-200'>
                    {webinar.title}
                  </Title>
                  <Text className='text-gray-400'>
                    <HtmlRenderer htmlString={webinar.description} />
                  </Text>
                  {webinar.category && (
                    <div className='mt-3'>
                      <Tag
                        style={{
                          backgroundColor: '#1890ff20',
                          color: '#1890ff',
                          border: 'none',
                        }}
                      >
                        {webinar.category}
                      </Tag>
                    </div>
                  )}
                </div>
              </div>

              <Descriptions
                column={1}
                labelStyle={{ color: '#9ca3af', fontWeight: '500' }}
                contentStyle={{ color: '#f9fafb' }}
              >
                <Descriptions.Item label='Host Company'>
                  <div className='flex items-center gap-2'>
                    <Building className='h-4 w-4 text-blue-400' />
                    {webinar.host?.name || 'Unknown Host'}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label='Timeslot'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-green-400' />
                    {webinar.timeslot?.timeslotName || 'No timeslot assigned'}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label='Duration'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 text-yellow-400' />
                    {getDurationText(webinar.duration)}
                  </div>
                </Descriptions.Item>
                {webinar.scheduledStartTime && (
                  <Descriptions.Item label='Scheduled Start'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-purple-400' />
                      {formatDateTime(webinar.scheduledStartTime)}
                    </div>
                  </Descriptions.Item>
                )}
                {webinar.maxParticipants && (
                  <Descriptions.Item label='Max Participants'>
                    <div className='flex items-center gap-2'>
                      <Users className='h-4 w-4 text-pink-400' />
                      {webinar.maxParticipants} people
                    </div>
                  </Descriptions.Item>
                )}
                {webinar.meetingLink && (
                  <Descriptions.Item label='Meeting Link'>
                    <div className='flex items-center gap-2'>
                      <Link className='h-4 w-4 text-indigo-400' />
                      <a
                        href={webinar.meetingLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-400 hover:text-blue-300'
                      >
                        Join Meeting
                      </a>
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {/* Participants and Analytics */}
            <Card
              title={
                <span className='flex items-center gap-2 text-lg font-medium text-gray-200'>
                  <Users className='h-5 w-5' />
                  Participants & Analytics
                </span>
              }
              className='border-0 shadow-lg'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <div className='py-8 text-center'>
                <Users className='mx-auto mb-4 h-12 w-12 text-gray-500' />
                <Text className='text-gray-400'>
                  Participant analytics will be available here
                </Text>
                <div className='mt-4'>
                  <Button
                    type='primary'
                    onClick={() =>
                      router.push(`/admin/participants?webinar=${webinar.id}`)
                    }
                    className='border-primary bg-primary hover:bg-primary-600'
                  >
                    Manage Participants
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column - Statistics & Actions */}
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
                      <span className='text-gray-400'>Total Registrations</span>
                    }
                    value={0}
                    valueStyle={{ color: '#f9fafb' }}
                    prefix={<User className='h-4 w-4' />}
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title={<span className='text-gray-400'>Attendees</span>}
                    value={0}
                    valueStyle={{ color: '#10b981' }}
                    prefix={<CheckCircle className='h-4 w-4' />}
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title={<span className='text-gray-400'>Duration</span>}
                    value={getDurationText(webinar.duration)}
                    valueStyle={{ color: '#f59e0b' }}
                    prefix={<Clock className='h-4 w-4' />}
                  />
                </Col>
              </Row>
            </Card>

            {/* Quick Actions */}
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
                {webinar.meetingLink && (
                  <Button
                    block
                    type='primary'
                    icon={<Play className='h-4 w-4' />}
                    onClick={() => window.open(webinar.meetingLink, '_blank')}
                    className='h-10 border-green-600 bg-green-600 hover:bg-green-700'
                    disabled={!isLive}
                  >
                    {isLive ? 'Join Live Meeting' : 'Meeting Link'}
                  </Button>
                )}
                <Button
                  block
                  icon={<Edit className='h-4 w-4' />}
                  onClick={() =>
                    router.push(`/admin/webinars/create/${webinar.id}`)
                  }
                  className='h-10 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                >
                  Edit Details
                </Button>
                <Button
                  block
                  icon={<Users className='h-4 w-4' />}
                  onClick={() =>
                    router.push(`/admin/participants?webinar=${webinar.id}`)
                  }
                  className='h-10 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                >
                  Manage Participants
                </Button>
                <Button
                  block
                  icon={<Globe className='h-4 w-4' />}
                  onClick={() => router.push('/admin/webinars')}
                  className='h-10 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                >
                  View All Webinars
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
