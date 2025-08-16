import { IJob } from '@/interfaces';

export const formatSalary = (job: IJob) => {
  if (!job.salaryMin && !job.salaryMax) return 'Negotiable';
  const currency = job.currency || 'BDT';
  if (job.salaryMin && job.salaryMax) {
    return `${currency} ${job.salaryMin} - ${currency} ${job.salaryMax}`;
  }
  if (job.salaryMin) {
    return `${currency} ${job.salaryMin}+`;
  }
  return `Up to ${currency} ${job.salaryMax}`;
};
