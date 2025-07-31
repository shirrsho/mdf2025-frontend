import React from 'react';
import { prefetchAllPublicTemplateQueryClient } from '@/apis';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { TemplateSection } from '../grid';

export const TemplateServerSide = () => {
  return (
    <HydrationBoundary
      state={dehydrate(prefetchAllPublicTemplateQueryClient())}
    >
      <TemplateSection />
    </HydrationBoundary>
  );
};
