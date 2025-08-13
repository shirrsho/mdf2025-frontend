import React from 'react';
import { CreateWebinarFormId } from '@/components/webinar';

interface EditWebinarPageProps {
  params: {
    id: string;
  };
}

const EditWebinarPage = ({ params }: EditWebinarPageProps) => {
  return (
    <div className='min-h-screen'>
      <CreateWebinarFormId webinarId={params.id} />
    </div>
  );
};

export default EditWebinarPage;
