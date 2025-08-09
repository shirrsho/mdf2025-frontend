'use client';
import { useGetUser } from '@/apis';
import { CompanyProfile } from '@/components/company/grid/CompanyProfile';
import React from 'react';

const DashboardPage = () => {
  const { data } = useGetUser();
  return <CompanyProfile user={data?.user} />;
};

export default DashboardPage;
