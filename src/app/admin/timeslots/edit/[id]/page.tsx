import React from 'react';
import { CreateTimeslotFormId } from '@/components/timeslot';

interface EditTimeslotPageProps {
  params: {
    id: string;
  };
}

const EditTimeslotPage = ({ params }: EditTimeslotPageProps) => {
  return (
    <div className='min-h-screen'>
      <CreateTimeslotFormId timeslotId={params.id} />
    </div>
  );
};

export default EditTimeslotPage;
