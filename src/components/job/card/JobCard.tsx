import { IJob, JobStatus } from '@/interfaces';
import { formatSalary } from '@/utils';
import { Calendar, MapPin, Building2, Circle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface JobCardProps {
  job: IJob;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();

  // Format date
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isJobOpen = job.status === JobStatus.OPEN;

  return (
    <div className='w-full max-w-xs overflow-hidden rounded-lg bg-[#141414] text-white shadow-lg'>
      {/* Header Section */}
      <div className='relative h-40 w-full'>
        {job.company?.logoUrl ? (
          <img
            src={job.company.logoUrl}
            alt={job.company.name}
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
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-4 ${
            job.company?.logoUrl ? 'hidden' : 'flex'
          }`}
        >
          <h2 className='text-center text-lg font-bold leading-tight text-white drop-shadow-lg'>
            {job.title}
          </h2>
        </div>

        {/* Status Badge */}
        {isJobOpen && (
          <div className='absolute right-3 top-3'>
            <div className='flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-xs font-medium text-white'>
              <Circle
                color='white'
                fill='white'
                size={8}
                className='animate-pulse'
              />
              Open
            </div>
          </div>
        )}
        {!isJobOpen && (
          <div className='absolute right-3 top-3'>
            <div className='flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white'>
              <Circle color='white' fill='white' size={8} />
              Closed
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className='p-4'>
        {/* Title */}
        <h3 className='mb-3 truncate text-lg font-semibold'>{job.title}</h3>

        {/* Company Info */}
        <div className='mb-3 flex items-center gap-2'>
          <Building2 className='h-3 w-3 flex-shrink-0 text-gray-400' />
          <span className='truncate text-xs text-gray-300'>
            {job.company?.name}
          </span>
        </div>

        {/* Job Details - Compact */}
        <div className='mb-4 space-y-2'>
          <div className='flex items-center gap-4 text-xs'>
            <div className='flex items-center gap-1'>
              <MapPin className='h-3 w-3 text-gray-400' />
              <span className='truncate text-gray-300'>{job.location}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='h-3 w-3 text-gray-400' />
              <span className='capitalize text-gray-300'>
                {job.type.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-4 text-xs'>
            <div className='flex items-center gap-1'>
              <span className='truncate text-gray-300'>
                {formatSalary(job)}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <Calendar className='h-3 w-3 text-gray-400' />
              <span className='text-gray-300'>
                {formatDate(job.applicationDeadline)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <button className='flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary-600 px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-primary-700'>
            Apply
          </button>
          <button
            onClick={() => router.push(`/p/jobs/${job.id}`)}
            className='flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-500 px-3 py-2 text-xs font-medium text-gray-400 transition-colors duration-200 hover:border-gray-400 hover:text-white'
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
