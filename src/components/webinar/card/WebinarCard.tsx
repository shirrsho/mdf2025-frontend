import { IWebinar } from '@/interfaces';
import { getWebinarDurationText, isWebinarLive } from '@/utils';
import { Calendar, Clock, Building2, Circle, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WebinarCardProps {
  webinar: IWebinar;
}

export const WebinarCard: React.FC<WebinarCardProps> = ({ webinar }) => {
  const router = useRouter();
  // Format date and time
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isLive = isWebinarLive(webinar);

  return (
    <div className='w-full max-w-xs overflow-hidden rounded-lg bg-[#141414] text-white shadow-lg'>
      {/* Header Image or Title Section */}
      <div className='relative h-40 w-full'>
        {webinar.bannerUrl ? (
          <img
            src={webinar.bannerUrl}
            alt={webinar.title}
            className='h-full w-full object-cover'
            onError={(e) => {
              // Hide image and show title background if image fails to load
              e.currentTarget.style.display = 'none';
              const titleDiv = e.currentTarget
                .nextElementSibling as HTMLElement;
              if (titleDiv) titleDiv.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Title Background - shown when no image or image fails */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 ${
            webinar.bannerUrl ? 'hidden' : 'flex'
          }`}
        >
          <h2 className='text-center text-lg font-bold leading-tight text-white drop-shadow-lg'>
            {webinar.title}
          </h2>
        </div>

        {/* Live Badge Only */}
        {isLive && (
          <div className='absolute right-3 top-3'>
            <div className='flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white'>
              <Circle
                color='white'
                fill='white'
                size={8}
                className='animate-pulse'
              />
              LIVE
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className='p-4'>
        {/* Title */}
        <h3 className='mb-3 truncate text-lg font-semibold'>{webinar.title}</h3>

        {/* Company Info */}
        <div className='mb-3 flex items-center gap-2'>
          <Building2 className='h-3 w-3 flex-shrink-0 text-gray-400' />
          <span className='truncate text-xs text-gray-300'>
            {webinar.host?.name}
          </span>
        </div>

        {/* Date, Time & Duration - Compact */}
        <div className='mb-4 space-y-2'>
          <div className='flex items-center gap-4 text-xs'>
            <div className='flex items-center gap-1'>
              <Calendar className='h-3 w-3 text-gray-400' />
              <span className='text-gray-300'>
                {formatDate(webinar?.scheduledStartTime)}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='h-3 w-3 text-gray-400' />
              <span className='text-gray-300'>
                {formatTime(webinar.scheduledStartTime)}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <Timer className='h-3 w-3 text-gray-400' />
              <span className='text-xs text-gray-300'>
                {getWebinarDurationText(webinar.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <button className='flex flex-1 items-center justify-center gap-1 rounded-lg bg-orange-600 px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-orange-700'>
            Join
          </button>
          <button
            onClick={() => router.push(`/p/webinars/${webinar.id}`)}
            className='flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-500 px-3 py-2 text-xs font-medium text-gray-400 transition-colors duration-200 hover:border-gray-400 hover:text-white'
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
