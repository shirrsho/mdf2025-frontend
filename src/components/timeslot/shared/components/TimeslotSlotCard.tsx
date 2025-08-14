import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Tag, Button } from 'antd';
import { CheckCircle, XCircle, Building2, Timer, Zap } from 'lucide-react';
import { TimeSlot } from '../hooks/useTimeslotUtils';

interface TimeslotSlotCardProps {
  slot: TimeSlot;
  onSlotClick?: (slot: TimeSlot) => void;
  showTimeslotName?: boolean;
  variant?: 'default' | 'overview';
}

export const TimeslotSlotCard: React.FC<TimeslotSlotCardProps> = ({
  slot,
  onSlotClick,
  showTimeslotName = false,
  variant = 'default',
}) => {
  const router = useRouter();

  const formatTime = (time: any) => {
    return time.format('HH:mm');
  };

  const handleClick = () => {
    if (onSlotClick) {
      onSlotClick(slot);
    } else {
      if (!slot.isOccupied) {
        router.push(
          `/admin/webinars/create?timeslot=${slot.timeslotId}&startTime=${slot.startTime.toISOString()}`
        );
      } else if (variant === 'overview') {
        router.push(`/admin/timeslots/${slot.timeslotId}`);
      }
    }
  };

  return (
    <div
      className={`group relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 ${
        slot.isOccupied
          ? 'border-red-800 bg-red-900/20 hover:border-red-700 hover:bg-red-900/30'
          : 'border-green-800 bg-green-900/20 hover:border-green-700 hover:bg-green-900/30 hover:shadow-md'
      } ${slot.isGrouped ? 'min-h-[160px]' : ''}`}
      onClick={handleClick}
    >
      {/* Timeslot Name (if shown) */}
      {showTimeslotName && (
        <div className='mb-2 text-xs font-medium text-gray-400'>
          {slot.timeslotName}
        </div>
      )}

      {/* Time Header */}
      <div className='mb-3 flex items-center justify-between'>
        <div
          className={`font-semibold text-white ${
            slot.isGrouped ? 'text-sm' : 'text-base'
          }`}
        >
          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
        </div>
        <div className='flex items-center gap-1'>
          {slot.isOccupied ? (
            <XCircle className='h-5 w-5 text-red-500' />
          ) : (
            <CheckCircle className='h-5 w-5 text-green-500' />
          )}
        </div>
      </div>

      {/* Duration for grouped slots */}
      {slot.isGrouped && (
        <div className='mb-2 text-xs text-gray-300 opacity-75'>
          Duration: {slot.webinar?.duration || 0} minutes
        </div>
      )}

      {/* Content */}
      {slot.isOccupied && slot.webinar ? (
        <div className='space-y-3'>
          <div className='line-clamp-2 text-sm font-medium text-white'>
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
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-700'>
                <Building2 className='h-4 w-4 text-gray-300' />
              </div>
            )}
            <span className='truncate text-sm text-gray-200'>
              {slot.webinar.host?.name || 'Unknown Host'}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <Timer className='h-4 w-4 text-yellow-500' />
              <span className='text-sm text-yellow-400'>
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
            <div className='mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-900/40'>
              <Zap className='h-5 w-5 text-green-400' />
            </div>
            <div className='text-sm font-medium text-green-400'>
              Available for Booking
            </div>
          </div>
          <div className='text-center'>
            {variant === 'overview' ? (
              <span className='text-xs text-blue-400 hover:text-blue-300'>
                Click to schedule webinar →
              </span>
            ) : (
              <Button
                type='link'
                size='small'
                className='p-0 text-xs text-blue-400 hover:text-blue-300'
              >
                Click to schedule webinar →
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
