import React from 'react';
import { prefetchAllPublicPaymentQueryClient } from '@/apis';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { PaymentSection } from '../grid';

export const PaymentServerSide = () => {
  return (
    <HydrationBoundary state={dehydrate(prefetchAllPublicPaymentQueryClient())}>
      <PaymentSection />
    </HydrationBoundary>
  );
};
