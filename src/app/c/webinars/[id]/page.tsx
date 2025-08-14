import React from 'react';
import { WebinarDetail } from '@/components/webinar';

interface WebinarDetailsPageProps {
  params: {
    id: string;
  };
}

const WebinarDetailsPage = ({ params }: WebinarDetailsPageProps) => {
  return <WebinarDetail webinarId={params.id} mode='company' />;
};

export default WebinarDetailsPage;
