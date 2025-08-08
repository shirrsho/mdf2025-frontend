import React from 'react';
import { prefetchAllPublicWebinarQueryClient } from '@/apis';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { WebinarSection } from '../grid';

export const WebinarServerSide = () => {
  return (
    <HydrationBoundary
      state={dehydrate(prefetchAllPublicWebinarQueryClient())}
    >
      <WebinarSection />
    </HydrationBoundary>
  );
};
