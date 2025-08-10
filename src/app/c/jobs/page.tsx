'use client';
import { useGetUser } from '@/apis';
import { CompanyJobList } from '@/components/job';
import React from 'react';

const DashboardPage = () => {
  const { data } = useGetUser();
  return <CompanyJobList companyId={data?.user?.companyId} />;
};

export default DashboardPage;
