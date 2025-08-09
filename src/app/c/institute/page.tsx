'use client';
import { useGetUser } from '@/apis';
import { CompanyProfile } from '@/components/company';
import React from 'react';

const DashboardPage = () => {
  const { data } = useGetUser();
  return <CompanyProfile mode='company' user={data?.user} />;
};

export default DashboardPage;
