import React from 'react';
import { prefetchAllPublicTimeslotQueryClient } from '@/apis';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { TimeslotSection } from '../grid';

export const TimeslotServerSide = () => {
  return (
    <HydrationBoundary
      state={dehydrate(prefetchAllPublicTimeslotQueryClient())}
    >
      <TimeslotSection />
    </HydrationBoundary>
  );
};
