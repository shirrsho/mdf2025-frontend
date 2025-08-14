'use client';
import React from 'react';
import { Button, Typography, Card, Row, Col } from 'antd';
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
} from 'lucide-react';
import { useGetWebinarById } from '@/apis';
import { HtmlRenderer } from '@/components/common';
import {
  getWebinarDisplayStatus,
  formatWebinarTime,
} from '@/utils/webinar.utils';

const { Title, Text } = Typography;

interface WebinarDetailProps {
  webinarId: string;
  mode?: 'admin' | 'company' | 'public';
}

export const WebinarDetail: React.FC<WebinarDetailProps> = ({
  webinarId,
  mode = 'admin',
}) => {
  const router = useRouter();
  const { data: webinar, isLoading } = useGetWebinarById(webinarId);

  const getBaseUrl = () => {
    switch (mode) {
      case 'company':
        return '/c';
      case 'public':
        return '';
      default:
        return '/admin';
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='mx-auto max-w-5xl px-4 py-8'>
          <div className='animate-pulse space-y-8'>
            <div className='h-6 w-24 rounded bg-gray-200 dark:bg-gray-700'></div>
            <div className='rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800'>
              <div className='flex flex-col gap-6 lg:flex-row'>
                <div className='h-32 w-32 rounded-xl bg-gray-200 dark:bg-gray-700'></div>
                <div className='flex-1 space-y-4'>
                  <div className='h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-4 w-full rounded bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700'></div>
                </div>
                <div className='h-11 w-32 rounded bg-gray-200 dark:bg-gray-700'></div>
              </div>
            </div>
            <div className='grid gap-8 lg:grid-cols-3'>
              <div className='space-y-8 lg:col-span-2'>
                <div className='h-64 rounded-xl bg-gray-200 dark:bg-gray-700'></div>
                <div className='h-48 rounded-xl bg-gray-200 dark:bg-gray-700'></div>
              </div>
              <div className='space-y-6'>
                <div className='h-32 rounded-xl bg-gray-200 dark:bg-gray-700'></div>
                <div className='h-40 rounded-xl bg-gray-200 dark:bg-gray-700'></div>
                <div className='h-36 rounded-xl bg-gray-200 dark:bg-gray-700'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-gray-800'>
          <h3 className='mb-4 text-xl font-bold text-red-600 dark:text-red-400'>
            Webinar Not Found
          </h3>
          <p className='mb-6 text-gray-600 dark:text-gray-300'>
            The webinar you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            type='primary'
            onClick={() => router.push(`${getBaseUrl()}/webinars`)}
            className='border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700'
          >
            Back to Webinars
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return { bg: '#1890ff20', color: '#1890ff' };
      case 'live':
        return { bg: '#52c41a20', color: '#52c41a' };
      case 'completed':
        return { bg: '#722ed120', color: '#722ed1' };
      case 'cancelled':
        return { bg: '#ff4d4f20', color: '#ff4d4f' };
      default:
        return { bg: '#8c8c8c20', color: '#8c8c8c' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Calendar className='h-5 w-5' />;
      case 'live':
        return <Play className='h-5 w-5' />;
      case 'completed':
        return <CheckCircle className='h-5 w-5' />;
      case 'cancelled':
        return <XCircle className='h-5 w-5' />;
      default:
        return <Pause className='h-5 w-5' />;
    }
  };

  const getDurationText = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} minutes` : ''}`;
    }
    return `${mins} minutes`;
  };

  const displayStatus = getWebinarDisplayStatus(webinar);
  const statusColors = getStatusColor(displayStatus.status);

  return (
    <div className='min-h-screen bg-background-100 py-8 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-6xl px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            icon={<ArrowLeft className='h-4 w-4' />}
            onClick={() => router.back()}
            className='mb-6 border-background-200 text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:text-paragraph-dark dark:hover:border-background-dark-200 dark:hover:text-heading-dark'
          >
            Back to Webinars
          </Button>

          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='flex items-start space-x-6'>
              {/* Webinar Banner */}
              <div className='flex-shrink-0'>
                {webinar.bannerUrl ? (
                  <img
                    src={webinar.bannerUrl}
                    alt={webinar.title}
                    className='h-24 w-24 rounded-2xl border-2 border-background-200 object-cover shadow-sm dark:border-background-dark-300'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-3xl font-bold text-white shadow-sm'>
                    {webinar.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Webinar Info */}
              <div className='flex-1'>
                <div className='mb-2 flex items-center gap-3'>
                  <Title
                    level={2}
                    className='mb-0 text-heading dark:text-heading-dark'
                  >
                    {webinar.title}
                  </Title>
                  <div
                    className='flex items-center gap-2 rounded-full border-0 px-3 py-1 font-medium text-white'
                    style={{
                      backgroundColor: statusColors.color,
                    }}
                  >
                    {getStatusIcon(displayStatus.status)}
                    <span className='text-sm'>{displayStatus.label}</span>
                  </div>
                </div>

                <div className='mb-4 flex flex-wrap items-center gap-4 text-paragraph dark:text-paragraph-dark'>
                  <div className='flex items-center space-x-2'>
                    <Building className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <span className='text-xl font-bold text-primary dark:text-primary-dark'>
                      {webinar.host?.name || 'Unknown Host'}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <span className='text-lg font-semibold text-secondary dark:text-secondary-dark'>
                      {formatWebinarTime(webinar)}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <span className='text-paragraph dark:text-paragraph-dark'>
                      {getDurationText(webinar.duration)}
                    </span>
                  </div>
                  {webinar.maxParticipants && (
                    <div className='flex items-center space-x-2'>
                      <Users className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                      <span className='text-paragraph dark:text-paragraph-dark'>
                        {webinar.maxParticipants} people max
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='flex-shrink-0'>
              <Button
                type='primary'
                size='large'
                icon={<Edit className='h-4 w-4' />}
                onClick={() =>
                  router.push(`${getBaseUrl()}/webinars/create/${webinar.id}`)
                }
                className='h-12 border-primary bg-primary px-8 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
              >
                ✏️ Edit Webinar
              </Button>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Webinar Description */}
          <Col xs={24} lg={16}>
            <Card className='h-full bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-4 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-dark-200 dark:text-primary-dark-300'>
                  📝
                </span>
                About the Webinar
              </Title>
              <div className='mb-6 text-base leading-relaxed text-paragraph dark:text-paragraph-dark'>
                <HtmlRenderer htmlString={webinar.description} />
              </div>

              {/* Highlighted Company and Time Info */}
              <div className='from-primary-50 to-secondary-50 mb-6 rounded-lg bg-gradient-to-r p-4 dark:from-primary-dark-200/20 dark:to-secondary-dark-200/20'>
                <div className='grid gap-4 sm:grid-cols-1'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-dark-200'>
                      <Building className='h-5 w-5 text-primary-600 dark:text-primary-dark-400' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-textColor dark:text-textColor-dark'>
                        Host Company
                      </p>
                      <p className='text-lg font-bold text-primary dark:text-primary-dark'>
                        {webinar.host?.name || 'Unknown Host'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-dark-200'>
                      <Calendar className='h-5 w-5 text-secondary-600 dark:text-secondary-dark-400' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-textColor dark:text-textColor-dark'>
                        Scheduled Time
                      </p>
                      <p className='text-lg font-bold text-secondary dark:text-secondary-dark'>
                        {formatWebinarTime(webinar)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {webinar.category && (
                <div className='mb-4'>
                  <p className='mb-2 text-sm font-medium text-textColor dark:text-textColor-dark'>
                    Category
                  </p>
                  <div
                    className='inline-block rounded-full border-0 px-3 py-1 text-sm font-medium'
                    style={{
                      backgroundColor: '#1890ff20',
                      color: '#1890ff',
                    }}
                  >
                    {webinar.category}
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* Contact Information / Sidebar */}
          <Col xs={24} lg={8}>
            <Card className='h-full bg-white shadow-sm dark:bg-background-dark-200'>
              <div className='mb-2 flex items-center justify-between'>
                <Title
                  level={5}
                  className='flex items-center text-heading dark:text-heading-dark'
                >
                  <div className='dark:bg-indigo-dark-200 mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100'>
                    <Users className='dark:text-indigo-dark-400 h-4 w-4 text-indigo-600' />
                  </div>
                  Quick Stats
                </Title>
              </div>

              <div className='space-y-4'>
                <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                  <div className='text-2xl font-bold text-heading dark:text-heading-dark'>
                    0
                  </div>
                  <Text className='text-sm text-paragraph dark:text-paragraph-dark'>
                    Registrations
                  </Text>
                </div>

                <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                  <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    0
                  </div>
                  <Text className='text-sm text-paragraph dark:text-paragraph-dark'>
                    Attendees
                  </Text>
                </div>

                <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                  <Clock className='mx-auto mb-2 h-8 w-8 text-yellow-600 dark:text-yellow-400' />
                  <Text
                    strong
                    className='block text-heading dark:text-heading-dark'
                  >
                    Duration
                  </Text>
                  <Text className='text-lg font-semibold text-yellow-600 dark:text-yellow-400'>
                    {getDurationText(webinar.duration)}
                  </Text>
                </div>

                {webinar.meetingLink && (
                  <div className='bg-primary-50 rounded-lg border border-primary-200 p-4 dark:border-primary-800 dark:bg-primary-900/20'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900'>
                        <Link className='h-4 w-4 text-primary-600 dark:text-primary-400' />
                      </div>
                      <div className='flex-1'>
                        <Text className='text-sm font-medium text-primary-900 dark:text-primary-100'>
                          Meeting Link
                        </Text>
                        <br />
                        <a
                          href={webinar.meetingLink}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
                        >
                          Join Meeting →
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Webinar Details */}
        <Row gutter={[24, 24]} className='mt-6'>
          <Col xs={24}>
            <Card className='bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-sm font-semibold text-secondary-600 dark:bg-secondary-dark-200 dark:text-secondary-dark-400'>
                  📊
                </span>
                Webinar Details
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Calendar className='mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Timeslot
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {webinar.timeslot?.timeslotName || 'No timeslot assigned'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <div
                      className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full'
                      style={{ backgroundColor: statusColors.color }}
                    >
                      <div className='text-white'>
                        {getStatusIcon(displayStatus.status)}
                      </div>
                    </div>
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Status
                    </Text>
                    <Text
                      className='font-semibold'
                      style={{ color: statusColors.color }}
                    >
                      {displayStatus.label}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Users className='mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Capacity
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {webinar.maxParticipants
                        ? `${webinar.maxParticipants} people`
                        : 'Unlimited'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Building className='mx-auto mb-2 h-8 w-8 text-orange-600 dark:text-orange-400' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Category
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {webinar.category || 'Uncategorized'}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
