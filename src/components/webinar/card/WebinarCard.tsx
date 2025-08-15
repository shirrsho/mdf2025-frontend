import { IWebinar } from '@/interfaces';
import { Calendar, Clock, Building2 } from 'lucide-react';

interface WebinarCardProps {
  webinar: IWebinar;
}

export const WebinarCard: React.FC<WebinarCardProps> = ({ webinar }) => {
  // Format date and time
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className='max-w-sm overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-md transition-all duration-200 hover:shadow-lg'>
      {/* Header Section */}
      <div className='relative h-32 w-full bg-gradient-to-r from-purple-600 to-blue-600'>
        <div className='absolute right-3 top-3'>
          <span className='rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white'>
            Available
          </span>
        </div>

        {/* Simple centered title */}
        <div className='absolute inset-0 flex items-center justify-center p-4'>
          <h2 className='text-center text-lg font-bold leading-tight text-white'>
            {webinar.title}
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className='space-y-3 p-4'>
        {/* Company Info */}
        <div className='flex items-center text-gray-300'>
          <Building2 className='mr-2 h-4 w-4 flex-shrink-0 text-blue-400' />
          <span className='truncate text-sm'>
            {webinar.host?.name || 'Company Name'}
          </span>
        </div>

        {/* Date and Time */}
        <div className='space-y-2'>
          <div className='flex items-center text-gray-300'>
            <Calendar className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400' />
            <span className='text-sm'>
              {webinar.scheduledStartTime
                ? formatDate(webinar.scheduledStartTime)
                : '27 Jul, 2025'}
            </span>
          </div>
          <div className='flex items-center text-gray-300'>
            <Clock className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400' />
            <span className='text-sm'>
              {webinar.scheduledStartTime
                ? formatTime(webinar.scheduledStartTime)
                : '10:00 AM'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2 pt-2'>
          <button className='flex-1 rounded bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-orange-600'>
            Join
          </button>
          <button className='flex-1 rounded border border-orange-500 px-4 py-2 text-sm font-medium text-orange-500 transition-colors duration-200 hover:bg-orange-500 hover:text-white'>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
