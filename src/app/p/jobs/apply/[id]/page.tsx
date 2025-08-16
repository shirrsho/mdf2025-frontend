import React from 'react';

interface JobDetailsPageProps {
  params: {
    id: string;
  };
}

const JobDetailsPage = ({ params }: JobDetailsPageProps) => {
  return <>apply {params?.id}</>;
};

export default JobDetailsPage;
