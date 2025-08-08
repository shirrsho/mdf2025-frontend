import React from 'react';
import { prefetchAllPublicRegistrationQueryClient } from '@/apis';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { RegistrationSection } from '../grid';

export const RegistrationServerSide = () => {
  return (
    <HydrationBoundary
      state={dehydrate(prefetchAllPublicRegistrationQueryClient())}
    >
      <RegistrationSection />
    </HydrationBoundary>
  );
};
