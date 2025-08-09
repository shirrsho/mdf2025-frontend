import React from 'react';
import { prefetchAllPublicCompanyQueryClient } from '@/apis';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { CompanySection } from '../grid';

export const CompanyServerSide = () => {
  return (
    <HydrationBoundary state={dehydrate(prefetchAllPublicCompanyQueryClient())}>
      <CompanySection />
    </HydrationBoundary>
  );
};
