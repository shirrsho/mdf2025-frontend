import { IJob } from '@/interfaces';

interface JobCardProps {
  job: IJob;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105'>
      <div className='relative flex h-48 w-full items-center justify-center'></div>
      <div className='p-4'>
        <h2 className='mb-2 text-xl font-semibold'>{job.title}</h2>
      </div>
    </div>
  );
};
