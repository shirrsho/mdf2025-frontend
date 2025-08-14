'use client';
import React from 'react';
import { Card, Button, Row, Col, Statistic, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Calendar,
  Users,
  Edit,
  CheckCircle,
  CalendarDays,
  Timer,
  Grid,
} from 'lucide-react';
import { useGetTimeslotById, useGetWebinarsByTimeslot } from '@/apis';
import { HtmlRenderer } from '@/components/common';
import {
  useTimeslotUtils,
  useTimeslotStats,
  TimeslotPageHeader,
  TimeslotLoadingState,
  TimeslotEmptyState,
  TimeslotStatusTag,
  TimeslotSlotCard,
} from '../shared';

const { Title, Text } = Typography;

interface TimeslotDetailProps {
  timeslotId: string;
}

export const TimeslotDetail: React.FC<TimeslotDetailProps> = ({
  timeslotId,
}) => {
  const router = useRouter();
  const { data: timeslot, isLoading } = useGetTimeslotById(timeslotId);
  const { data: webinarsData } = useGetWebinarsByTimeslot(timeslotId);

  const webinars = webinarsData?.data || [];

  const {
    formatTime,
    formatDate,
    formatDuration,
    getTimeslotStatus,
    createTimeSlots,
  } = useTimeslotUtils();

  const { utilizationRate } = useTimeslotStats({
    timeslots: timeslot ? [timeslot] : [],
    webinars,
  });

  if (isLoading) {
    return <TimeslotLoadingState message='Loading timeslot details...' />;
  }

  if (!timeslot) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-900'>
        <Card className='bg-gray-800 p-8 text-center'>
          <Title level={3} className='mb-4 text-red-400'>
            Access Denied
          </Title>
          <Text className='mb-6 text-gray-300'>
            Sorry, this timeslot could not be found or has been removed.
          </Text>
          <Button
            type='primary'
            onClick={() => router.push('/admin/timeslots')}
            className='border-primary bg-primary text-white hover:border-primary-600 hover:bg-primary-600'
          >
            Back to Timeslots
          </Button>
        </Card>
      </div>
    );
  }

  const timeSlots = createTimeSlots(timeslot, webinars);
  const statusInfo = getTimeslotStatus(timeslot);

  const headerActions = (
    <>
      <Button
        size='large'
        icon={<Grid className='h-4 w-4' />}
        onClick={() => router.push('/admin/timeslots/overview')}
        className='h-12 border-indigo-400 px-6 font-medium text-indigo-400 hover:border-indigo-300 hover:bg-indigo-900/20 hover:text-indigo-300'
      >
        📊 All Slots
      </Button>
      <Button
        type='primary'
        size='large'
        icon={<Edit className='h-4 w-4' />}
        onClick={() => router.push(`/admin/timeslots/create/${timeslot.id}`)}
        className='h-12 border-primary bg-primary px-8 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
      >
        ✏️ Edit Timeslot
      </Button>
    </>
  );

  const headerInfo = (
    <div className='mb-4 flex flex-wrap items-center gap-4 text-gray-300'>
      <div className='flex items-baseline gap-3'>
        <TimeslotStatusTag statusInfo={statusInfo} />
      </div>
      <div className='flex items-center space-x-2'>
        <CalendarDays className='h-4 w-4 text-gray-200' />
        <Text className='text-paragraph dark:text-paragraph-dark'>
          {formatDate(timeslot.startTime)}
        </Text>
      </div>
      <div className='flex items-center space-x-2'>
        <Clock className='h-4 w-4 text-textColor dark:text-textColor-dark' />
        <Text strong className='text-heading dark:text-heading-dark'>
          {formatTime(timeslot.startTime)} - {formatTime(timeslot.endTime)}
        </Text>
      </div>
      <div className='flex items-center space-x-2'>
        <Timer className='h-4 w-4 text-gray-200' />
        <Text className='text-gray-300'>
          {formatDuration(timeslot.startTime, timeslot.endTime)} duration
        </Text>
      </div>
      <div className='flex items-center space-x-2'>
        <Users className='h-4 w-4 text-gray-200' />
        <Text className='text-gray-300'>
          {webinars.length} webinar
          {webinars.length !== 1 ? 's' : ''} scheduled
        </Text>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-900 py-8'>
      <div className='mx-auto max-w-6xl px-6'>
        {/* Header */}
        <TimeslotPageHeader
          title={timeslot.timeslotName}
          backUrl='/admin/timeslots'
          backLabel='Back to Timeslots'
          icon={Calendar}
          actions={headerActions}
        >
          {headerInfo}
        </TimeslotPageHeader>

        {/* Time Slot Schedule Card */}
        <Card className='!mt-6 bg-gray-800 shadow-sm'>
          <Title
            level={4}
            className='mb-6 flex items-center justify-between text-white'
          >
            <span className='flex items-center'>
              <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-900/40 text-sm font-semibold text-purple-400'>
                🎯
              </span>
              Time Slot Schedule
            </span>
            <div className='flex items-center gap-4 text-sm'>
              <span className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-green-500'></div>
                <Text className='text-gray-200'>Available</Text>
              </span>
              <span className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-red-500'></div>
                <Text className='text-gray-200'>Booked</Text>
              </span>
            </div>
          </Title>

          <div className='mb-4 rounded-lg bg-gray-700 p-4'>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text className='text-sm font-medium text-white'>
                  Total Slots: {timeSlots.length}
                </Text>
              </Col>
              <Col span={12}>
                <Text className='text-sm font-medium text-white'>
                  Booked:{' '}
                  {timeSlots.filter((slot: any) => slot.isOccupied).length}
                </Text>
              </Col>
            </Row>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {timeSlots.map((slot: any) => (
              <TimeslotSlotCard
                key={slot.id}
                slot={slot}
                onSlotClick={(clickedSlot: any) => {
                  if (!clickedSlot.isOccupied) {
                    router.push(
                      `/admin/webinars/create?timeslot=${timeslot.id}&startTime=${clickedSlot.startTime.toISOString()}`
                    );
                  }
                }}
              />
            ))}
          </div>

          {timeSlots.length === 0 && (
            <TimeslotEmptyState
              title='No Time Slots Available'
              message="This timeslot doesn't have any configured time slots yet."
              actionLabel='Configure Time Slots'
              onAction={() =>
                router.push(`/admin/timeslots/create/${timeslot.id}`)
              }
            />
          )}
        </Card>

        <Row gutter={[24, 24]} className='mt-6'>
          {/* Left Column - Description & Schedule */}
          <Col xs={24} lg={16}>
            {/* Timeslot Description */}
            <Card className='mb-6 h-full bg-gray-800 shadow-sm'>
              <Title level={4} className='mb-4 flex items-center text-white'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-900/40 text-sm font-semibold text-purple-400'>
                  📝
                </span>
                About this Timeslot
              </Title>
              <div className='mb-6 min-h-24 text-base leading-relaxed text-gray-300'>
                {timeslot.description ? (
                  <HtmlRenderer htmlString={timeslot.description} />
                ) : (
                  <Text className='italic text-gray-400'>
                    No description provided for this timeslot.
                  </Text>
                )}
              </div>
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-gray-700 p-4 text-center'>
                    <Calendar className='mx-auto mb-2 h-8 w-8 text-purple-400' />
                    <Text strong className='block text-white'>
                      Date
                    </Text>
                    <Text className='text-gray-300'>
                      {formatDate(timeslot.startTime)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-gray-700 py-4 text-center'>
                    <Clock className='mx-auto mb-2 h-8 w-8 text-indigo-400' />
                    <Text strong className='block text-white'>
                      Time
                    </Text>
                    <Text className='whitespace-nowrap text-gray-300'>
                      {formatTime(timeslot.startTime)} -{' '}
                      {formatTime(timeslot.endTime)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-gray-700 p-4 text-center'>
                    <Timer className='mx-auto mb-2 h-8 w-8 text-blue-400' />
                    <Text strong className='block text-white'>
                      Duration
                    </Text>
                    <Text className='text-gray-300'>
                      {formatDuration(timeslot.startTime, timeslot.endTime)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-gray-700 p-4 text-center'>
                    <Users className='mx-auto mb-2 h-8 w-8 text-green-400' />
                    <Text strong className='block text-white'>
                      Utilization
                    </Text>
                    <Text className='text-gray-300'>
                      {utilizationRate}% Used
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Quick Stats & Actions */}
          <Col xs={24} lg={8}>
            {/* Quick Stats */}
            <Card className='mb-6 bg-gray-800 shadow-sm'>
              <Title level={4} className='mb-6 flex items-center text-white'>
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/40 text-sm font-semibold text-blue-400'>
                  📊
                </span>
                Quick Statistics
              </Title>
              <Row gutter={[16, 24]}>
                <Col span={24}>
                  <Statistic
                    title={
                      <span className='text-gray-300'>Scheduled Webinars</span>
                    }
                    value={webinars.length}
                    valueStyle={{
                      color: '#10b981',
                      fontSize: '28px',
                      fontWeight: '600',
                    }}
                    suffix={<Users className='h-5 w-5 text-green-500' />}
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title={
                      <span className='text-gray-300'>Available Slots</span>
                    }
                    value={
                      timeSlots.filter((slot: any) => !slot.isOccupied).length
                    }
                    valueStyle={{
                      color: '#f59e0b',
                      fontSize: '28px',
                      fontWeight: '600',
                    }}
                    suffix={<CheckCircle className='h-5 w-5 text-yellow-500' />}
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title={<span className='text-gray-300'>Capacity Used</span>}
                    value={utilizationRate}
                    suffix='%'
                    valueStyle={{
                      color: utilizationRate > 80 ? '#ef4444' : '#6366f1',
                      fontSize: '28px',
                      fontWeight: '600',
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
