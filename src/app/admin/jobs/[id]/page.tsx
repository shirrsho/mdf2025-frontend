import React from 'react';
import { JobDetail } from '@/components/job';

interface JobDetailsPageProps {
  params: {
    id: string;
  };
}

const JobDetailsPage = ({ params }: JobDetailsPageProps) => {
  return <JobDetail jobId={params.id} mode='admin' />;
};

export default JobDetailsPage;
