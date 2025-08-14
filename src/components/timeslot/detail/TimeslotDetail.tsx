'use client';
import React from 'react';
import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Typography,
  Avatar,
  Tag,
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
  Building2,
  CalendarDays,
  Timer,
  Zap,
  Grid,
} from 'lucide-react';
import { useGetTimeslotById, useGetWebinarsByTimeslot } from '@/apis';
import { HtmlRenderer } from '@/components/common';
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
  const { data: webinarsData } = useGetWebinarsByTimeslot(timeslotId);

  const webinars = webinarsData?.data || [];

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background-100 p-6 dark:bg-background-dark-100'>
        <div className='mx-auto max-w-6xl'>
          <div className='text-lg text-paragraph dark:text-paragraph-dark'>
            Loading timeslot details...
          </div>
        </div>
      </div>
    );
  }

  if (!timeslot) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <Card className='bg-white p-8 text-center dark:bg-background-dark-200'>
          <Title level={3} className='mb-4 text-danger dark:text-danger-dark'>
            Timeslot Not Found
          </Title>
          <Text className='mb-6 text-paragraph dark:text-paragraph-dark'>
            The timeslot you&apos;re looking for doesn&apos;t exist or has been
            removed.
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

  const formatTime = (date: string | Date) => {
    return dayjs(date).format('hh:mm A');
  };

  const formatDate = (date: string | Date) => {
    return dayjs(date).format('MMMM DD, YYYY');
  };

  const calculateDuration = () => {
    const start = dayjs(timeslot.startTime);
    const end = dayjs(timeslot.endTime);
    const duration = end.diff(start, 'minutes');
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const isUpcoming = dayjs(timeslot.startTime).isAfter(dayjs());
  const isActive = dayjs().isBetween(
    dayjs(timeslot.startTime),
    dayjs(timeslot.endTime)
  );

  const getStatusInfo = () => {
    if (isActive) {
      return {
        status: 'Live Now',
        color: '#10b981',
        bgColor: '#10b98120',
        description: 'This timeslot is currently active',
        icon: <Zap className='h-5 w-5' style={{ color: '#10b981' }} />,
      };
    } else if (isUpcoming) {
      return {
        status: 'Upcoming',
        color: '#f59e0b',
        bgColor: '#f59e0b20',
        description: 'Scheduled for the future',
        icon: <Clock className='h-5 w-5' style={{ color: '#f59e0b' }} />,
      };
    } else {
      return {
        status: 'Completed',
        color: '#6b7280',
        bgColor: '#6b728020',
        description: 'This timeslot has ended',
        icon: <CheckCircle className='h-5 w-5' style={{ color: '#6b7280' }} />,
      };
    }
  };

  // Create time slots visualization data with grouped webinars
  const createTimeSlots = () => {
    if (!timeslot) return [];

    const start = dayjs(timeslot.startTime);
    const end = dayjs(timeslot.endTime);
    const duration = end.diff(start, 'minutes');
    const slotDuration = 30; // 30 minute slots
    const totalSlots = Math.ceil(duration / slotDuration);

    const slots = [];
    const processedWebinars = new Set();

    for (let i = 0; i < totalSlots; i++) {
      const slotStart = start.add(i * slotDuration, 'minutes');
      const slotEnd = start.add((i + 1) * slotDuration, 'minutes');

      // Check if this slot is occupied by a webinar
      const occupyingWebinar = webinars.find((webinar) => {
        const webinarStart = dayjs(
          webinar.scheduledStartTime || timeslot.startTime
        );
        const webinarEnd = webinarStart.add(webinar.duration, 'minutes');
        return slotStart.isBefore(webinarEnd) && slotEnd.isAfter(webinarStart);
      });

      if (occupyingWebinar && !processedWebinars.has(occupyingWebinar.id)) {
        // This is a new webinar, create a grouped slot for it
        const webinarStart = dayjs(
          occupyingWebinar.scheduledStartTime || timeslot.startTime
        );
        const webinarEnd = webinarStart.add(
          occupyingWebinar.duration,
          'minutes'
        );

        slots.push({
          id: `webinar-${occupyingWebinar.id}`,
          startTime: webinarStart,
          endTime: webinarEnd,
          isOccupied: true,
          webinar: occupyingWebinar,
          isGrouped: true,
        });

        processedWebinars.add(occupyingWebinar.id);

        // Skip ahead to after this webinar
        const webinarDurationSlots = Math.ceil(
          occupyingWebinar.duration / slotDuration
        );
        i += webinarDurationSlots - 1;
      } else if (!occupyingWebinar) {
        // This is an available slot
        slots.push({
          id: i,
          startTime: slotStart,
          endTime: slotEnd,
          isOccupied: false,
          webinar: null,
          isGrouped: false,
        });
      }
      // If occupyingWebinar exists but is already processed, skip this slot
    }

    return slots;
  };

  const timeSlots = createTimeSlots();
  const statusInfo = getStatusInfo();

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
            Back to Timeslots
          </Button>

          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='flex items-start space-x-6'>
              {/* Timeslot Icon */}
              <div className='flex-shrink-0'>
                <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-3xl font-bold text-white shadow-sm'>
                  <Calendar className='h-12 w-12' />
                </div>
              </div>

              {/* Timeslot Info */}
              <div className='flex-1'>
                <div className='mb-2 flex items-baseline gap-3'>
                  <Title
                    level={2}
                    className='mb-0 text-heading dark:text-heading-dark'
                  >
                    {timeslot.timeslotName}
                  </Title>
                  <Tag
                    style={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                      border: `1px solid ${statusInfo.color}30`,
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'inline-flex',
                    }}
                  >
                    {statusInfo.icon}
                    <span className='ml-1'>{statusInfo.status}</span>
                  </Tag>
                </div>

                <div className='mb-4 flex flex-wrap items-center gap-4 text-paragraph dark:text-paragraph-dark'>
                  <div className='flex items-center space-x-2'>
                    <CalendarDays className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {formatDate(timeslot.startTime)}
                    </Text>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text
                      strong
                      className='text-heading dark:text-heading-dark'
                    >
                      {formatTime(timeslot.startTime)} -{' '}
                      {formatTime(timeslot.endTime)}
                    </Text>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Timer className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {calculateDuration()} duration
                    </Text>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Users className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {webinars.length} webinar
                      {webinars.length !== 1 ? 's' : ''} scheduled
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='flex-shrink-0'>
              <Space>
                <Button
                  size='large'
                  icon={<Grid className='h-4 w-4' />}
                  onClick={() => router.push('/admin/timeslots/overview')}
                  className='h-12 border-indigo-600 px-6 font-medium text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-500 dark:border-indigo-400 dark:text-indigo-400 dark:hover:border-indigo-300 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-300'
                >
                  📊 All Slots
                </Button>
                <Button
                  type='primary'
                  size='large'
                  icon={<Edit className='h-4 w-4' />}
                  onClick={() =>
                    router.push(`/admin/timeslots/create/${timeslot.id}`)
                  }
                  className='h-12 border-primary bg-primary px-8 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
                >
                  ✏️ Edit Timeslot
                </Button>
              </Space>
            </div>
          </div>
        </div>

        <Card className='!mt-6 bg-white shadow-sm dark:bg-background-dark-200'>
          <Title
            level={4}
            className='mb-6 flex items-center justify-between text-heading dark:text-heading-dark'
          >
            <span className='flex items-center'>
              <span className='dark:bg-purple-dark-200 dark:text-purple-dark-400 mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600'>
                🎯
              </span>
              Time Slot Schedule
            </span>
            <div className='flex items-center gap-4 text-sm'>
              <span className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-green-500'></div>
                <Text className='text-paragraph dark:text-paragraph-dark'>
                  Available
                </Text>
              </span>
              <span className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-red-500'></div>
                <Text className='text-paragraph dark:text-paragraph-dark'>
                  Booked
                </Text>
              </span>
            </div>
          </Title>

          <div className='mb-4 rounded-lg bg-background-100 p-4 dark:bg-background-dark-100'>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text className='text-sm font-medium text-heading dark:text-heading-dark'>
                  Total Slots: {timeSlots.length}
                </Text>
              </Col>
              <Col span={12}>
                <Text className='text-sm font-medium text-heading dark:text-heading-dark'>
                  Booked: {timeSlots.filter((slot) => slot.isOccupied).length}
                </Text>
              </Col>
            </Row>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className={`group relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 ${
                  slot.isOccupied
                    ? 'border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:border-red-700 dark:hover:bg-red-900/30'
                    : 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 hover:shadow-md dark:border-green-800 dark:bg-green-900/20 dark:hover:border-green-700 dark:hover:bg-green-900/30'
                } ${slot.isGrouped ? 'min-h-[140px]' : ''}`}
                onClick={() => {
                  if (!slot.isOccupied) {
                    router.push(
                      `/admin/webinars/create?timeslot=${timeslot.id}&startTime=${slot.startTime.toISOString()}`
                    );
                  }
                }}
              >
                <div className='mb-3 flex items-center justify-between'>
                  <div
                    className={`font-semibold text-heading dark:text-heading-dark ${
                      slot.isGrouped ? 'text-sm' : 'text-base'
                    }`}
                  >
                    {slot.isGrouped
                      ? `${slot.startTime.format('HH:mm')} - ${slot.endTime.format('HH:mm')}`
                      : `${slot.startTime.format('HH:mm')} - ${slot.endTime.format('HH:mm')}`}
                  </div>
                  <div className='flex items-center gap-1'>
                    {slot.isOccupied ? (
                      <XCircle className='h-5 w-5 text-red-500' />
                    ) : (
                      <CheckCircle className='h-5 w-5 text-green-500' />
                    )}
                  </div>
                </div>

                {slot.isGrouped && (
                  <div className='mb-2 text-xs text-paragraph opacity-75 dark:text-paragraph-dark'>
                    Duration: {slot.webinar?.duration || 0} minutes
                  </div>
                )}

                {slot.isOccupied && slot.webinar ? (
                  <div className='space-y-3'>
                    <div className='line-clamp-2 text-sm font-medium text-heading dark:text-heading-dark'>
                      {slot.webinar.title}
                    </div>
                    <div className='flex items-center gap-2'>
                      {slot.webinar.host?.logoUrl ? (
                        <Avatar
                          size={24}
                          src={slot.webinar.host.logoUrl}
                          className='flex-shrink-0'
                        />
                      ) : (
                        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-background-200 dark:bg-background-dark-200'>
                          <Building2 className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                        </div>
                      )}
                      <span className='truncate text-sm text-paragraph dark:text-paragraph-dark'>
                        {slot.webinar.host?.name || 'Unknown Host'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-1'>
                        <Timer className='h-4 w-4 text-yellow-500' />
                        <span className='text-sm text-yellow-600 dark:text-yellow-400'>
                          {slot.webinar.duration}min
                        </span>
                      </div>
                      <Tag color='blue' className='m-0'>
                        Scheduled
                      </Tag>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <div className='text-center'>
                      <div className='mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40'>
                        <Zap className='h-5 w-5 text-green-600 dark:text-green-400' />
                      </div>
                      <div className='text-sm font-medium text-green-600 dark:text-green-400'>
                        Available for Booking
                      </div>
                    </div>
                    <div className='text-center'>
                      <Button
                        type='link'
                        size='small'
                        className='p-0 text-xs text-primary hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-400'
                      >
                        Click to schedule webinar →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {timeSlots.length === 0 && (
            <div className='py-12 text-center'>
              <CalendarDays className='text-textColor-light dark:text-textColor-dark-light mx-auto mb-4 h-16 w-16' />
              <Title
                level={4}
                className='mb-2 text-textColor dark:text-textColor-dark'
              >
                No Time Slots Available
              </Title>
              <Text className='text-paragraph dark:text-paragraph-dark'>
                This timeslot doesn&apos;t have any configured time slots yet.
              </Text>
              <div className='mt-4'>
                <Button
                  type='primary'
                  icon={<Edit className='h-4 w-4' />}
                  onClick={() =>
                    router.push(`/admin/timeslots/create/${timeslot.id}`)
                  }
                >
                  Configure Time Slots
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Row gutter={[24, 24]} className='mt-6'>
          {/* Left Column - Description & Schedule */}
          <Col xs={24} lg={16}>
            {/* Timeslot Description */}
            <Card className='mb-6 h-full bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-4 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-dark-200 dark:text-primary-dark-300'>
                  📝
                </span>
                About this Timeslot
              </Title>
              <div className='mb-6 min-h-24 text-base leading-relaxed text-paragraph dark:text-paragraph-dark'>
                {timeslot.description ? (
                  <HtmlRenderer htmlString={timeslot.description} />
                ) : (
                  <Text className='italic text-textColor dark:text-textColor-dark'>
                    No description provided for this timeslot.
                  </Text>
                )}
              </div>
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Calendar className='mx-auto mb-2 h-8 w-8 text-primary dark:text-primary-dark' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Date
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {formatDate(timeslot.startTime)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 py-4 text-center dark:bg-background-dark-100'>
                    <Clock className='mx-auto mb-2 h-8 w-8 text-indigo-600 dark:text-indigo-dark-600' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Time
                    </Text>
                    <Text className='whitespace-nowrap text-paragraph dark:text-paragraph-dark'>
                      {formatTime(timeslot.startTime)} -{' '}
                      {formatTime(timeslot.endTime)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Timer className='mx-auto mb-2 h-8 w-8 text-secondary dark:text-secondary-dark' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Duration
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {calculateDuration()}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Users className='mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-dark-600' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Utilization
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {timeSlots.length > 0
                        ? Math.round(
                            (timeSlots.filter((slot) => slot.isOccupied)
                              .length /
                              timeSlots.length) *
                              100
                          )
                        : 0}
                      % Used
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Schedule Information */}
            {/* <Card className='mb-6 bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-dark-200 dark:text-indigo-dark-400'>
                  📅
                </span>
                Schedule Details
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Calendar className='mx-auto mb-2 h-8 w-8 text-primary dark:text-primary-dark' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Date
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {formatDate(timeslot.startTime)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Clock className='mx-auto mb-2 h-8 w-8 text-indigo-600 dark:text-indigo-dark-600' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Time
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {formatTime(timeslot.startTime)} - {formatTime(timeslot.endTime)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Timer className='mx-auto mb-2 h-8 w-8 text-secondary dark:text-secondary-dark' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Duration
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {calculateDuration()}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Users className='mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-dark-600' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Utilization
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {timeSlots.length > 0
                        ? Math.round(
                            (timeSlots.filter((slot) => slot.isOccupied)
                              .length /
                              timeSlots.length) *
                              100
                          )
                        : 0}% Used
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card> */}
          </Col>

          {/* Right Column - Quick Stats & Actions */}
          <Col xs={24} lg={8}>
            {/* Quick Stats */}
            <Card className='mb-6 bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-sm font-semibold text-secondary-600 dark:bg-secondary-dark-200 dark:text-secondary-dark-400'>
                  📊
                </span>
                Quick Statistics
              </Title>
              <Row gutter={[16, 24]}>
                <Col span={24}>
                  <Statistic
                    title={
                      <span className='text-textColor dark:text-textColor-dark'>
                        Scheduled Webinars
                      </span>
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
                      <span className='text-textColor dark:text-textColor-dark'>
                        Available Slots
                      </span>
                    }
                    value={timeSlots.filter((slot) => !slot.isOccupied).length}
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
                    title={
                      <span className='text-textColor dark:text-textColor-dark'>
                        Capacity Used
                      </span>
                    }
                    value={
                      timeSlots.length > 0
                        ? Math.round(
                            (timeSlots.filter((slot) => slot.isOccupied)
                              .length /
                              timeSlots.length) *
                              100
                          )
                        : 0
                    }
                    suffix='%'
                    valueStyle={{
                      color:
                        timeSlots.length > 0 &&
                        timeSlots.filter((slot) => slot.isOccupied).length /
                          timeSlots.length >
                          0.8
                          ? '#ef4444'
                          : '#6366f1',
                      fontSize: '28px',
                      fontWeight: '600',
                    }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Quick Actions */}
            {/* <Card className='bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600 dark:bg-green-dark-200 dark:text-green-dark-400'>
                  ⚡
                </span>
                Quick Actions
              </Title>
              <Space direction='vertical' className='w-full' size='middle'>
                <Button
                  block
                  type='primary'
                  size='large'
                  icon={<Plus className='h-4 w-4' />}
                  onClick={() =>
                    router.push(
                      `/admin/webinars/create?timeslot=${timeslot.id}`
                    )
                  }
                  className='h-12 border-primary bg-primary font-medium hover:bg-primary-600'
                >
                  🚀 Schedule New Webinar
                </Button>
                <Button
                  block
                  size='large'
                  icon={<Edit className='h-4 w-4' />}
                  onClick={() =>
                    router.push(`/admin/timeslots/create/${timeslot.id}`)
                  }
                  className='h-12 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white dark:border-gray-500 dark:text-gray-400 dark:hover:border-gray-400 dark:hover:text-gray-200'
                >
                  ✏️ Edit Timeslot
                </Button>
                <Button
                  block
                  size='large'
                  icon={<Calendar className='h-4 w-4' />}
                  onClick={() => router.push('/admin/timeslots')}
                  className='h-12 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white dark:border-gray-500 dark:text-gray-400 dark:hover:border-gray-400 dark:hover:text-gray-200'
                >
                  📋 View All Timeslots
                </Button>
              </Space>
            </Card> */}
          </Col>
        </Row>

        {/* Time Slots Visualization */}
      </div>
    </div>
  );
};
