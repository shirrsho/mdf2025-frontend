import React from 'react';
import { prefetchAllPublicApplicationQueryClient } from '@/apis';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ApplicationSection } from '../grid';

export const ApplicationServerSide = () => {
  return (
    <HydrationBoundary
      state={dehydrate(prefetchAllPublicApplicationQueryClient())}
    >
      <ApplicationSection />
    </HydrationBoundary>
  );
};
