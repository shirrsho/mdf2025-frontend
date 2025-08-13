import React from 'react';
import { WebinarDetail } from '@/components/webinar';

interface WebinarDetailPageProps {
  params: {
    id: string;
  };
}

const WebinarDetailPage = ({ params }: WebinarDetailPageProps) => {
  return <WebinarDetail webinarId={params.id} />;
};

export default WebinarDetailPage;
