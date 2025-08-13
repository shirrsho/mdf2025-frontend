import React from 'react';
import { OptionsalParamsType } from '@/types';
import { CreateTimeslotFormId } from '@/components/timeslot';

const CreateJobPage = ({ params }: OptionsalParamsType) => {
  const timeslotId = params.id?.[0];
  return (
    <div className='min-h-screen'>
      <CreateTimeslotFormId timeslotId={timeslotId} />
    </div>
  );
};

export default CreateJobPage;
