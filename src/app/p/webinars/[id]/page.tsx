import React from 'react';
import { WebinarDetail } from '@/components/webinar';

interface WebinarDetailsPageProps {
  params: {
    id: string;
  };
}

const WebinarDetailsPage = ({ params }: WebinarDetailsPageProps) => {
  return <WebinarDetail webinarId={params.id} mode='public' />;
};

export default WebinarDetailsPage;
