'use client';
import { useGetUser } from '@/apis';
import { CompanyWebinarList } from '@/components/webinar';
import React from 'react';

const DashboardPage = () => {
  const { data } = useGetUser();
  return <CompanyWebinarList companyId={data?.user?.companyId} />;
};

export default DashboardPage;
