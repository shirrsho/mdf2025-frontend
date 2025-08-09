import React from 'react';
import { prefetchAllPublicJobQueryClient } from '@/apis';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { JobSection } from '../grid';

export const JobServerSide = () => {
  return (
    <HydrationBoundary state={dehydrate(prefetchAllPublicJobQueryClient())}>
      <JobSection />
    </HydrationBoundary>
  );
};
