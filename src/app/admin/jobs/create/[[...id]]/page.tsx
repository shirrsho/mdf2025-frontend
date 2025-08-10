import React from 'react';
import { OptionsalParamsType } from '@/types';
import { CreateJobFormId } from '@/components/job';

const CreateJobPage = ({ params }: OptionsalParamsType) => {
  const jobId = params.id?.[0];
  return (
    <div className='min-h-screen'>
      <CreateJobFormId mode='admin' jobId={jobId} />
    </div>
  );
};

export default CreateJobPage;
