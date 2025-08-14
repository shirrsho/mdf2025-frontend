import React from 'react';
import { OptionsalParamsType } from '@/types';
import { CreateWebinarFormId } from '@/components/webinar';

const CreateWebinarPage = ({ params }: OptionsalParamsType) => {
  const webinarId = params.id?.[0];

  return (
    <div className='min-h-screen'>
      <CreateWebinarFormId webinarId={webinarId} mode='company' />
    </div>
  );
};

export default CreateWebinarPage;
