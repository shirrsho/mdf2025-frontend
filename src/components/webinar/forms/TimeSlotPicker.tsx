'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, message } from 'antd';
import { Clock } from 'lucide-react';
import { useGetAllWebinars } from '@/apis';
import { useGetTimeslotById } from '@/apis/timeslot';
import dayjs from 'dayjs';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  disabled: boolean;
  isSelected: boolean;
}

interface TimeSlotPickerProps {
  value?: { scheduledStartTime?: string; duration?: number };
  onChange?: (value: { scheduledStartTime: string; duration: number }) => void;
  timeslotId?: string;
  disabled?: boolean;
  excludeWebinarId?: string;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  value,
  onChange,
  timeslotId,
  disabled = false,
  excludeWebinarId,
}) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const isInitialLoadRef = useRef(true);

  const { data: timeslotData } = useGetTimeslotById(timeslotId);
  const { data: webinarsData } = useGetAllWebinars({
    timeslotId: timeslotId || '',
    limit: 1000,
  });

  // Generate 30-minute time slots
  const generateTimeSlots = useCallback((): TimeSlot[] => {
    if (!timeslotData?.startTime || !timeslotData?.endTime) return [];

    const slots: TimeSlot[] = [];
    const startDateTime = dayjs(timeslotData?.startTime);
    const endDateTime = dayjs(timeslotData?.endTime);
    let currentSlot = startDateTime;

    while (currentSlot.isBefore(endDateTime)) {
      const slotEnd = currentSlot.add(30, 'minutes');
      if (slotEnd.isAfter(endDateTime)) break;

      slots.push({
        id: currentSlot.format('YYYY-MM-DD-HH:mm'),
        startTime: currentSlot.toISOString(),
        endTime: slotEnd.toISOString(),
        disabled: false,
        isSelected: false,
      });

      currentSlot = slotEnd;
    }
    return slots;
  }, [timeslotData]);

  // Check if slot conflicts with existing webinars
  const isSlotBooked = useCallback(
    (slot: TimeSlot): boolean => {
      if (!webinarsData?.data) return false;

      const slotStart = dayjs(slot.startTime);
      const slotEnd = dayjs(slot.endTime);

      return webinarsData.data.some((webinar) => {
        if (!webinar.scheduledStartTime || !webinar.duration) return false;
        if (excludeWebinarId && webinar.id === excludeWebinarId) return false;

        const webinarStart = dayjs(webinar.scheduledStartTime);
        const webinarEnd = webinarStart.add(webinar.duration, 'minutes');

        return slotStart.isBefore(webinarEnd) && slotEnd.isAfter(webinarStart);
      });
    },
    [webinarsData, excludeWebinarId]
  );

  // Update time slots when data changes
  useEffect(() => {
    const slots = generateTimeSlots().map((slot) => ({
      ...slot,
      disabled: isSlotBooked(slot),
    }));
    setTimeSlots(slots);
  }, [generateTimeSlots, isSlotBooked]);

  // Update selected slots when value or timeSlots change
  useEffect(() => {
    if (value?.scheduledStartTime && value?.duration && timeSlots.length > 0) {
      const startTime = dayjs(value.scheduledStartTime);
      const slotsNeeded = Math.ceil(value.duration / 30);
      const newSelectedSlots: string[] = [];

      for (let i = 0; i < slotsNeeded; i++) {
        const slotTime = startTime.add(i * 30, 'minutes');
        const slotId = slotTime.format('YYYY-MM-DD-HH:mm');
        if (timeSlots.some((slot) => slot.id === slotId)) {
          newSelectedSlots.push(slotId);
        }
      }

      const currentSelection = selectedSlots.sort().join(',');
      const newSelection = newSelectedSlots.sort().join(',');

      if (currentSelection !== newSelection) {
        setSelectedSlots(newSelectedSlots);
      }
    } else if (!value?.scheduledStartTime || !value?.duration) {
      if (selectedSlots.length > 0) {
        setSelectedSlots([]);
      }
    }
  }, [value, timeSlots]);

  // Update visual state
  useEffect(() => {
    setTimeSlots((prevSlots) =>
      prevSlots.map((slot) => ({
        ...slot,
        isSelected: selectedSlots.includes(slot.id),
      }))
    );
  }, [selectedSlots]);

  // Auto-confirm selection changes
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    if (timeSlots.length === 0) return;

    if (selectedSlots.length > 0) {
      const firstSlot = timeSlots.find(
        (slot) => slot.id === selectedSlots.sort()[0]
      );
      if (firstSlot) {
        const startTime = dayjs(firstSlot.startTime).toISOString();
        const duration = selectedSlots.length * 30;

        if (
          !value ||
          value.scheduledStartTime !== startTime ||
          value.duration !== duration
        ) {
          onChange?.({ scheduledStartTime: startTime, duration });
        }
      }
    } else if (value?.scheduledStartTime || value?.duration) {
      onChange?.(undefined as any);
    }
  }, [selectedSlots]);

  const handleSlotClick = (clickedSlot: TimeSlot) => {
    if (clickedSlot.disabled) {
      message.warning('This time slot is already booked');
      return;
    }

    const clickedIndex = timeSlots.findIndex(
      (slot) => slot.id === clickedSlot.id
    );

    if (selectedSlots.length === 0) {
      setSelectedSlots([clickedSlot.id]);
      return;
    }

    const selectedIndices = selectedSlots
      .map((slotId) => timeSlots.findIndex((slot) => slot.id === slotId))
      .filter((index) => index !== -1)
      .sort((a, b) => a - b);

    const [firstIndex, lastIndex] = [
      selectedIndices[0],
      selectedIndices[selectedIndices.length - 1],
    ];

    let startIndex: number, endIndex: number;

    if (clickedIndex < firstIndex) {
      [startIndex, endIndex] = [clickedIndex, lastIndex];
    } else if (clickedIndex > lastIndex) {
      [startIndex, endIndex] = [firstIndex, clickedIndex];
    } else if (selectedSlots.includes(clickedSlot.id)) {
      if (clickedIndex === firstIndex && selectedSlots.length > 1) {
        [startIndex, endIndex] = [firstIndex + 1, lastIndex];
      } else if (clickedIndex === lastIndex && selectedSlots.length > 1) {
        [startIndex, endIndex] = [firstIndex, lastIndex - 1];
      } else {
        setSelectedSlots([clickedSlot.id]);
        return;
      }
    } else {
      setSelectedSlots([clickedSlot.id]);
      return;
    }

    const slotsInRange = timeSlots.slice(startIndex, endIndex + 1);

    if (slotsInRange.some((slot) => slot.disabled)) {
      message.warning('Cannot select range with booked time slots');
      return;
    }

    setSelectedSlots(slotsInRange.map((slot) => slot.id));
  };

  if (disabled) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <Clock className='mx-auto mb-3 h-12 w-12 text-gray-400 opacity-30' />
        <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
          Time Selection Disabled
        </div>
        <div className='text-xs text-gray-400 dark:text-gray-500'>
          Please select a timeslot first
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Clock className='h-4 w-4 text-primary' />
          <span className='text-sm font-medium text-heading dark:text-heading-dark'>
            Select Time Slots (30min each, Select Multiple for Longer Sessions)
          </span>
        </div>
        {selectedSlots.length > 0 && (
          <Button
            // size='small'
            onClick={() => setSelectedSlots([])}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            Clear Selection
          </Button>
        )}
      </div>

      {timeSlots.length === 0 ? (
        <div className='py-8 text-center text-gray-400 dark:text-gray-500'>
          <Clock className='mx-auto mb-2 h-8 w-8 opacity-50' />
          <div className='text-sm'>Loading time slots...</div>
        </div>
      ) : (
        <>
          <div className='max-h-64 overflow-y-auto rounded-lg border border-background-200 p-3 dark:border-background-dark-300'>
            <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6'>
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2 text-center text-xs font-medium transition-all duration-200 ${
                    slot.disabled
                      ? 'cursor-not-allowed border-red-300 bg-red-50 text-red-500 opacity-60 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : slot.isSelected
                        ? 'transform border-primary bg-primary text-white shadow-lg dark:border-primary-400 dark:bg-primary-600'
                        : 'hover:bg-primary-50 border-background-200 bg-white text-paragraph hover:border-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-paragraph-dark dark:hover:border-primary-400 dark:hover:bg-primary-900/20'
                  } ${!slot.disabled ? 'hover:shadow-md' : ''}`}
                >
                  <div className='text-xs font-semibold'>
                    {dayjs(slot.startTime).format('h:mm A')}
                  </div>
                  <div className='text-xs opacity-70'>
                    {dayjs(slot.startTime).format('MMM DD')}
                  </div>
                  {/* {slot.disabled && (
                    <div className='text-xs font-semibold text-red-500 dark:text-red-400'>
                      Booked
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>

          <div className='flex items-center justify-between text-xs'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center gap-1'>
                <div className='h-3 w-3 rounded border-2 border-primary bg-primary'></div>
                <span className='text-paragraph dark:text-paragraph-dark'>
                  Selected
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='h-3 w-3 rounded border-2 border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30'></div>
                <span className='text-paragraph dark:text-paragraph-dark'>
                  Booked
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='h-3 w-3 rounded border-2 border-background-200 bg-white dark:border-background-dark-300 dark:bg-background-dark-100'></div>
                <span className='text-paragraph dark:text-paragraph-dark'>
                  Available
                </span>
              </div>
            </div>

            {selectedSlots.length > 0 && (
              <div className='text-right'>
                <div className='font-semibold text-primary'>
                  {selectedSlots.length * 30} minutes
                </div>
                <div className='text-gray-500 dark:text-gray-400'>
                  {selectedSlots.length} slot
                  {selectedSlots.length > 1 ? 's' : ''} selected
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
