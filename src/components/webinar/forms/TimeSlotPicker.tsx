'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Popover, Card, message } from 'antd';
import { Clock, ChevronDown } from 'lucide-react';
import { useGetAllWebinars } from '@/apis';
import { useGetTimeslotById } from '@/apis/timeslot';
import dayjs from 'dayjs';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  disabled: boolean;
  isSelected: boolean;
  isInRange: boolean;
}

interface TimeSlotPickerProps {
  value?: {
    scheduledStartTime?: string;
    duration?: number;
  };
  onChange?: (value: { scheduledStartTime: string; duration: number }) => void;
  timeslotId?: string;
  disabled?: boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  value,
  onChange,
  timeslotId,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Get the specific timeslot data to determine the time range
  const { data: timeslotData } = useGetTimeslotById(timeslotId);

  // Get existing webinars to check for conflicts
  const { data: webinarsData } = useGetAllWebinars({
    timeslotId: timeslotId || '',
    limit: 1000, // Get all webinars for the timeslot
  });

  // Generate 30-minute time slots based on the timeslot's actual date/time range
  const generateTimeSlots = useCallback((): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    if (!timeslotData?.startTime || !timeslotData?.endTime) {
      return slots; // Return empty if no timeslot data
    }

    const startDateTime = dayjs(timeslotData.startTime);
    const endDateTime = dayjs(timeslotData.endTime);

    let currentSlot = startDateTime;

    // Generate 30-minute slots from start to end of the timeslot
    while (currentSlot.isBefore(endDateTime)) {
      const slotEnd = currentSlot.add(30, 'minutes');

      // Don't create a slot if it would go beyond the timeslot end
      if (slotEnd.isAfter(endDateTime)) {
        break;
      }

      const slotId = `${currentSlot.format('YYYY-MM-DD-HH:mm')}`;

      slots.push({
        id: slotId,
        startTime: currentSlot.toISOString(),
        endTime: slotEnd.toISOString(),
        label: `${currentSlot.format('MMM DD, h:mm A')} - ${slotEnd.format('h:mm A')}`,
        disabled: false,
        isSelected: false,
        isInRange: false,
      });

      currentSlot = slotEnd;
    }

    return slots;
  }, [timeslotData]);

  // Check if a time slot conflicts with existing webinars
  const isSlotBooked = useCallback(
    (slot: TimeSlot): boolean => {
      if (!webinarsData?.data) return false;

      const slotStart = dayjs(slot.startTime);
      const slotEnd = dayjs(slot.endTime);

      return webinarsData.data.some((webinar) => {
        if (!webinar.scheduledStartTime || !webinar.duration) return false;

        const webinarStart = dayjs(webinar.scheduledStartTime);
        const webinarEnd = webinarStart.add(webinar.duration, 'minutes');

        // Check if the slot overlaps with the webinar
        return (
          (slotStart.isBefore(webinarEnd) && slotEnd.isAfter(webinarStart)) ||
          slotStart.isSame(webinarStart) ||
          slotEnd.isSame(webinarEnd)
        );
      });
    },
    [webinarsData]
  );

  // Update time slots when timeslot data or webinars data changes
  useEffect(() => {
    const slots = generateTimeSlots();
    const updatedSlots = slots.map((slot) => ({
      ...slot,
      disabled: isSlotBooked(slot),
    }));
    setTimeSlots(updatedSlots);
  }, [generateTimeSlots, isSlotBooked]);

  // Update selected slots when value changes
  useEffect(() => {
    if (value?.scheduledStartTime && value?.duration) {
      const startTime = dayjs(value.scheduledStartTime);
      const durationMinutes = value.duration;
      const slotsNeeded = Math.ceil(durationMinutes / 30);

      const newSelectedSlots: string[] = [];

      for (let i = 0; i < slotsNeeded; i++) {
        const slotTime = startTime.add(i * 30, 'minutes');
        const slotId = slotTime.format('YYYY-MM-DD-HH:mm');
        newSelectedSlots.push(slotId);
      }

      setSelectedSlots(newSelectedSlots);
    } else {
      setSelectedSlots([]);
    }
  }, [value]);

  // Update visual state of slots
  useEffect(() => {
    setTimeSlots((prevSlots) =>
      prevSlots.map((slot) => ({
        ...slot,
        isSelected: selectedSlots.includes(slot.id),
        isInRange: false, // Not needed anymore since all selected slots look the same
      }))
    );
  }, [selectedSlots]);

  const handleSlotClick = (clickedSlot: TimeSlot) => {
    if (clickedSlot.disabled) {
      message.warning('This time slot is already booked');
      return;
    }

    const clickedSlotIndex = timeSlots.findIndex(
      (slot) => slot.id === clickedSlot.id
    );

    if (selectedSlots.length === 0) {
      // First slot selection
      setSelectedSlots([clickedSlot.id]);
    } else {
      // Find the range from the first selected slot to the clicked slot
      const selectedIndices = selectedSlots
        .map((slotId) => timeSlots.findIndex((slot) => slot.id === slotId))
        .filter((index) => index !== -1)
        .sort((a, b) => a - b);

      const firstSelectedIndex = selectedIndices[0];
      const lastSelectedIndex = selectedIndices[selectedIndices.length - 1];

      // Determine the new range
      let startIndex: number;
      let endIndex: number;

      if (clickedSlotIndex < firstSelectedIndex) {
        // Clicking before the current selection - extend backwards
        startIndex = clickedSlotIndex;
        endIndex = lastSelectedIndex;
      } else if (clickedSlotIndex > lastSelectedIndex) {
        // Clicking after the current selection - extend forwards
        startIndex = firstSelectedIndex;
        endIndex = clickedSlotIndex;
      } else {
        // Clicking within or at the edges of current selection
        if (selectedSlots.includes(clickedSlot.id)) {
          // Clicking on a selected slot - adjust the range
          if (
            clickedSlotIndex === firstSelectedIndex &&
            selectedSlots.length > 1
          ) {
            // Remove from start
            startIndex = firstSelectedIndex + 1;
            endIndex = lastSelectedIndex;
          } else if (
            clickedSlotIndex === lastSelectedIndex &&
            selectedSlots.length > 1
          ) {
            // Remove from end
            startIndex = firstSelectedIndex;
            endIndex = lastSelectedIndex - 1;
          } else {
            // Single slot or middle slot - deselect all and select just this one
            setSelectedSlots([clickedSlot.id]);
            return;
          }
        } else {
          // Clicking in the middle of selection range - should not happen normally
          setSelectedSlots([clickedSlot.id]);
          return;
        }
      }

      // Get all slots in the new range
      const slotsInRange = timeSlots.slice(startIndex, endIndex + 1);

      // Check if any slots in the range are disabled
      const hasDisabledSlots = slotsInRange.some((slot) => slot.disabled);

      if (hasDisabledSlots) {
        message.warning('Cannot select range with booked time slots');
        return;
      }

      // Select all slots in the range
      const newSelectedSlots = slotsInRange.map((slot) => slot.id);
      setSelectedSlots(newSelectedSlots);
    }
  };

  const handleConfirm = () => {
    if (selectedSlots.length === 0) {
      message.warning('Please select at least one time slot');
      return;
    }

    const sortedSlots = selectedSlots.sort();
    const firstSlot = timeSlots.find((slot) => slot.id === sortedSlots[0]);

    if (firstSlot) {
      const startTime = dayjs(firstSlot.startTime);
      const duration = selectedSlots.length * 30; // 30 minutes per slot

      onChange?.({
        scheduledStartTime: startTime.toISOString(),
        duration: duration,
      });

      setVisible(false);
    }
  };

  const handleClear = () => {
    setSelectedSlots([]);
    onChange?.(undefined as any);
  };

  const getDisplayText = () => {
    if (selectedSlots.length === 0) {
      return 'Select time slots';
    }

    const sortedSlots = selectedSlots.sort();
    const firstSlot = timeSlots.find((slot) => slot.id === sortedSlots[0]);
    const lastSlot = timeSlots.find(
      (slot) => slot.id === sortedSlots[sortedSlots.length - 1]
    );

    if (firstSlot && lastSlot) {
      const startTime = dayjs(firstSlot.startTime).format('h:mm A');
      const endTime = dayjs(lastSlot.endTime).format('h:mm A');
      const duration = selectedSlots.length * 30;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      let durationText = '';
      if (hours > 0) {
        durationText = `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
      } else {
        durationText = `${minutes}m`;
      }

      return `${startTime} - ${endTime} (${durationText})`;
    }

    return 'Select time slots';
  };

  const timeSlotContent = (
    <div className='max-h-96 w-[600px] overflow-y-auto'>
      <Card
        title={
          <div className='flex items-center justify-between'>
            <span className='text-gray-200'>
              Select Time Slots (30min each)
            </span>
            <div className='flex gap-2'>
              <Button
                size='small'
                onClick={handleClear}
                className='border-gray-600 text-gray-400'
              >
                Clear
              </Button>
              <Button
                size='small'
                type='primary'
                onClick={handleConfirm}
                disabled={selectedSlots.length === 0}
                className='border-primary bg-primary'
              >
                Confirm
              </Button>
            </div>
          </div>
        }
        className='border-0'
        style={{ backgroundColor: '#2a2a2a' }}
        bodyStyle={{ padding: '16px' }}
      >
        {timeSlots.length === 0 ? (
          <div className='py-8 text-center text-gray-400'>
            Please select a timeslot first
          </div>
        ) : (
          <>
            <div className='grid max-h-80 grid-cols-4 gap-2 overflow-y-auto p-2'>
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-3 text-center text-xs font-medium transition-all duration-200 ${
                    slot.disabled
                      ? 'cursor-not-allowed border-red-700 bg-red-900/30 text-red-400 opacity-60'
                      : slot.isSelected
                        ? 'scale-105 transform border-blue-500 bg-blue-600 text-white shadow-lg'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-blue-400 hover:bg-gray-700 hover:text-white'
                  } ${!slot.disabled ? 'hover:shadow-md' : ''} `}
                >
                  <div className='mb-1 text-sm font-semibold'>
                    {dayjs(slot.startTime).format('h:mm A')}
                  </div>
                  <div className='text-xs opacity-80'>
                    {dayjs(slot.startTime).format('MMM DD')}
                  </div>
                  <div className='mt-1 text-xs opacity-60'>30min</div>
                  {slot.disabled && (
                    <div className='mt-1 text-xs font-semibold text-red-400'>
                      Booked
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='mt-4 border-t border-gray-600 pt-4'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2 text-xs text-gray-400'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded border border-blue-500 bg-blue-600'></div>
                    <span>Selected</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded border-2 border-red-700 bg-red-900/30'></div>
                    <span>Booked</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded border-2 border-gray-600 bg-gray-800'></div>
                    <span>Available</span>
                  </div>
                </div>

                {selectedSlots.length > 0 && (
                  <div className='text-right'>
                    <div className='mb-1 text-sm font-semibold text-white'>
                      {selectedSlots.length * 30} minutes
                    </div>
                    <div className='text-xs text-gray-400'>
                      {selectedSlots.length} slot
                      {selectedSlots.length > 1 ? 's' : ''} selected
                    </div>
                    <div className='mt-1 text-xs text-gray-500'>
                      {(() => {
                        const duration = selectedSlots.length * 30;
                        const hours = Math.floor(duration / 60);
                        const minutes = duration % 60;
                        if (hours > 0) {
                          return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
                        }
                        return `${minutes}m`;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );

  return (
    <Popover
      content={timeSlotContent}
      trigger='click'
      open={visible}
      onOpenChange={setVisible}
      placement='bottomLeft'
      overlayClassName='time-slot-picker-popover'
    >
      <Button
        className={`flex h-12 w-full items-center justify-between border-gray-600 text-left ${disabled ? 'bg-gray-900 text-gray-500' : 'bg-gray-800 text-white hover:border-gray-500'} `}
        disabled={disabled}
      >
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 text-gray-400' />
          <span
            className={
              selectedSlots.length > 0 ? 'text-white' : 'text-gray-400'
            }
          >
            {getDisplayText()}
          </span>
        </div>
        <ChevronDown className='h-4 w-4 text-gray-400' />
      </Button>
    </Popover>
  );
};
