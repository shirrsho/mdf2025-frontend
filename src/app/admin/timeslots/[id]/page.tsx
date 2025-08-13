import React from 'react';
import { TimeslotDetail } from '@/components/timeslot';

interface TimeslotDetailPageProps {
  params: {
    id: string;
  };
}

const TimeslotDetailPage: React.FC<TimeslotDetailPageProps> = ({ params }) => {
  return <TimeslotDetail timeslotId={params.id} />;
};

export default TimeslotDetailPage;
