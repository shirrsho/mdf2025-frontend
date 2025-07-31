import React from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

export const GoogleAnalyticsContainer: React.FC = () => {
  return (
    <>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? 'G-GW2PJ4JHTR'}
      />
    </>
  );
};
