'use client';
import React, { useMemo } from 'react';
import { Card, Button, Row, Col, Typography, Avatar, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Building2,
  Plus,
  CalendarDays,
  Timer,
  Zap,
  Grid,
} from 'lucide-react';
import { useGetAllTimeslots, useGetAllWebinars } from '@/apis';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { Title, Text } = Typography;

interface TimeSlot {
  id: string;
  timeslotId: string;
  timeslotName: string;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  isOccupied: boolean;
  webinar?: any;
  isGrouped: boolean;
  originalTimeslot: any;
}

export const TimeslotOverview: React.FC = () => {
  const router = useRouter();
  const { data: timeslotsData, isLoading: timeslotsLoading } =
    useGetAllTimeslots({ limit: 1000 });
  const { data: webinarsData, isLoading: webinarsLoading } = useGetAllWebinars({
    limit: 1000,
  });

  const timeslots = timeslotsData?.data || [];
  const webinars = webinarsData?.data || [];

  // Create all time slots from all timeslots with their booking status
  const allTimeSlots = useMemo(() => {
    if (!timeslots.length) return [];

    const slots: TimeSlot[] = [];

    timeslots.forEach((timeslot) => {
      const start = dayjs(timeslot.startTime);
      const end = dayjs(timeslot.endTime);
      const duration = end.diff(start, 'minutes');
      const slotDuration = 30; // 30 minute slots
      const totalSlots = Math.ceil(duration / slotDuration);

      // Get webinars for this timeslot
      const timeslotWebinars = webinars.filter(
        (webinar) =>
          webinar.timeslotId === timeslot.id ||
          webinar.timeslot?.id === timeslot.id
      );

      const processedWebinars = new Set();

      for (let i = 0; i < totalSlots; i++) {
        const slotStart = start.add(i * slotDuration, 'minutes');
        const slotEnd = start.add((i + 1) * slotDuration, 'minutes');

        // Check if this slot is occupied by a webinar
        const occupyingWebinar = timeslotWebinars.find((webinar) => {
          const webinarStart = dayjs(
            webinar.scheduledStartTime || timeslot.startTime
          );
          const webinarEnd = webinarStart.add(webinar.duration, 'minutes');
          return (
            slotStart.isBefore(webinarEnd) && slotEnd.isAfter(webinarStart)
          );
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
            id: `${timeslot.id}-webinar-${occupyingWebinar.id}`,
            timeslotId: timeslot.id!,
            timeslotName: timeslot.timeslotName,
            startTime: webinarStart,
            endTime: webinarEnd,
            isOccupied: true,
            webinar: occupyingWebinar,
            isGrouped: true,
            originalTimeslot: timeslot,
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
            id: `${timeslot.id}-slot-${i}`,
            timeslotId: timeslot.id!,
            timeslotName: timeslot.timeslotName,
            startTime: slotStart,
            endTime: slotEnd,
            isOccupied: false,
            webinar: null,
            isGrouped: false,
            originalTimeslot: timeslot,
          });
        }
      }
    });

    // Sort slots by start time
    return slots.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
  }, [timeslots, webinars]);

  // Group slots by date for better organization
  const slotsByDate = useMemo(() => {
    const grouped: Record<string, TimeSlot[]> = {};

    allTimeSlots.forEach((slot) => {
      const dateKey = slot.startTime.format('YYYY-MM-DD');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });

    return grouped;
  }, [allTimeSlots]);

  const formatTime = (date: dayjs.Dayjs) => {
    return date.format('HH:mm');
  };

  const formatDateKey = (dateKey: string) => {
    return dayjs(dateKey).format('MMMM DD, YYYY - dddd');
  };

  const getDateStatus = (dateKey: string) => {
    const date = dayjs(dateKey);
    const today = dayjs();

    if (date.isSame(today, 'day')) {
      return { label: 'Today', color: '#10b981', bgColor: '#10b98120' };
    } else if (date.isAfter(today)) {
      return { label: 'Upcoming', color: '#f59e0b', bgColor: '#f59e0b20' };
    } else {
      return { label: 'Past', color: '#ef4444', bgColor: '#ef444420' };
    }
  };

  const stats = useMemo(() => {
    const totalSlots = allTimeSlots.length;
    const bookedSlots = allTimeSlots.filter((slot) => slot.isOccupied).length;
    const availableSlots = totalSlots - bookedSlots;
    const uniqueTimeslots = new Set(allTimeSlots.map((slot) => slot.timeslotId))
      .size;

    return {
      totalSlots,
      bookedSlots,
      availableSlots,
      uniqueTimeslots,
      utilizationRate:
        totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0,
    };
  }, [allTimeSlots]);

  if (timeslotsLoading || webinarsLoading) {
    return (
      <div className='min-h-screen bg-background-100 p-6 dark:bg-background-dark-100'>
        <div className='mx-auto max-w-7xl'>
          <div className='text-lg text-paragraph dark:text-paragraph-dark'>
            Loading timeslot overview...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background-100 py-8 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-7xl px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            icon={<ArrowLeft className='h-4 w-4' />}
            onClick={() => router.push('/admin/timeslots')}
            className='mb-6 border-background-200 text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:text-paragraph-dark dark:hover:border-background-dark-200 dark:hover:text-heading-dark'
          >
            Back to Timeslots
          </Button>

          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='flex items-start space-x-6'>
              {/* Overview Icon */}
              <div className='flex-shrink-0'>
                <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-sm'>
                  <Grid className='h-12 w-12' />
                </div>
              </div>

              {/* Overview Info */}
              <div className='flex-1'>
                <Title
                  level={2}
                  className='mb-2 text-heading dark:text-heading-dark'
                >
                  All Time Slots Overview
                </Title>
                <Text className='mb-4 text-lg text-paragraph dark:text-paragraph-dark'>
                  Complete view of all time slots across all timeslots with
                  booking status
                </Text>

                <div className='flex flex-wrap items-center gap-4 text-paragraph dark:text-paragraph-dark'>
                  <div className='flex items-center space-x-2'>
                    <CalendarDays className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {stats.uniqueTimeslots} Timeslots
                    </Text>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Grid className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {stats.totalSlots} Total Slots
                    </Text>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Users className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {stats.utilizationRate}% Utilization
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='flex-shrink-0'>
              <Button
                type='primary'
                size='large'
                icon={<Plus className='h-4 w-4' />}
                onClick={() => router.push('/admin/timeslots/create')}
                className='h-12 border-primary bg-primary px-8 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
              >
                Create New Timeslot
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className='mb-6'>
          <Col xs={24} sm={12} lg={6}>
            <Card className='border border-blue-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-blue-800/50 dark:bg-background-dark-200'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                  <Grid className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div className='flex-1'>
                  <Text className='text-xs font-medium text-blue-700 dark:text-blue-300'>
                    Total Slots
                  </Text>
                  <div className='text-xl font-bold text-blue-900 dark:text-blue-100'>
                    {stats.totalSlots}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className='border border-green-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-green-800/50 dark:bg-background-dark-200'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30'>
                  <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <div className='flex-1'>
                  <Text className='text-xs font-medium text-green-700 dark:text-green-300'>
                    Available
                  </Text>
                  <div className='text-xl font-bold text-green-900 dark:text-green-100'>
                    {stats.availableSlots}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className='border border-red-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-red-800/50 dark:bg-background-dark-200'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30'>
                  <XCircle className='h-5 w-5 text-red-600 dark:text-red-400' />
                </div>
                <div className='flex-1'>
                  <Text className='text-xs font-medium text-red-700 dark:text-red-300'>
                    Booked
                  </Text>
                  <div className='text-xl font-bold text-red-900 dark:text-red-100'>
                    {stats.bookedSlots}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className='border border-purple-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-purple-800/50 dark:bg-background-dark-200'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30'>
                  <Users className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                </div>
                <div className='flex-1'>
                  <Text className='text-xs font-medium text-purple-700 dark:text-purple-300'>
                    Utilization
                  </Text>
                  <div className='text-xl font-bold text-purple-900 dark:text-purple-100'>
                    {stats.utilizationRate}%
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Time Slots by Date */}
        {Object.entries(slotsByDate).map(([dateKey, slots]) => {
          const dateStatus = getDateStatus(dateKey);

          return (
            <Card
              key={dateKey}
              className='!mb-6 bg-white shadow-sm dark:bg-background-dark-200'
            >
              <div className='mb-6 flex items-center justify-between'>
                <div className='flex items-baseline gap-4'>
                  <Title
                    level={4}
                    className='mb-0 text-heading dark:text-heading-dark'
                  >
                    {formatDateKey(dateKey)}
                  </Title>
                  <Tag
                    style={{
                      backgroundColor: dateStatus.bgColor,
                      color: dateStatus.color,
                      border: `1px solid ${dateStatus.color}30`,
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {dateStatus.label}
                  </Tag>
                </div>
                <div className='flex items-center gap-4 text-sm'>
                  <span className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-green-500'></div>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {slots.filter((slot) => !slot.isOccupied).length}{' '}
                      Available
                    </Text>
                  </span>
                  <span className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-red-500'></div>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {slots.filter((slot) => slot.isOccupied).length} Booked
                    </Text>
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`group relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 ${
                      slot.isOccupied
                        ? 'border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:border-red-700 dark:hover:bg-red-900/30'
                        : 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 hover:shadow-md dark:border-green-800 dark:bg-green-900/20 dark:hover:border-green-700 dark:hover:bg-green-900/30'
                    } ${slot.isGrouped ? 'min-h-[160px]' : ''}`}
                    onClick={() => {
                      if (!slot.isOccupied) {
                        router.push(
                          `/admin/webinars/create?timeslot=${slot.timeslotId}&startTime=${slot.startTime.toISOString()}`
                        );
                      } else {
                        router.push(`/admin/timeslots/${slot.timeslotId}`);
                      }
                    }}
                  >
                    {/* Timeslot Name */}
                    <div className='mb-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
                      {slot.timeslotName}
                    </div>

                    <div className='mb-3 flex items-center justify-between'>
                      <div
                        className={`font-semibold text-heading dark:text-heading-dark ${
                          slot.isGrouped ? 'text-sm' : 'text-base'
                        }`}
                      >
                        {formatTime(slot.startTime)} -{' '}
                        {formatTime(slot.endTime)}
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
                          <Text className='text-xs text-primary hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-400'>
                            Click to schedule webinar →
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {Object.keys(slotsByDate).length === 0 && (
          <Card className='bg-white py-16 text-center shadow-sm dark:bg-background-dark-200'>
            <CalendarDays className='text-textColor-light dark:text-textColor-dark-light mx-auto mb-4 h-16 w-16' />
            <Title
              level={4}
              className='mb-2 text-textColor dark:text-textColor-dark'
            >
              No Time Slots Available
            </Title>
            <Text className='mb-6 text-paragraph dark:text-paragraph-dark'>
              Create some timeslots to see their time slots here.
            </Text>
            <Button
              type='primary'
              size='large'
              icon={<Plus className='h-4 w-4' />}
              onClick={() => router.push('/admin/timeslots/create')}
            >
              Create Your First Timeslot
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
