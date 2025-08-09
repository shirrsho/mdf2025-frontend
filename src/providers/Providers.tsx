'use client';
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import {
  AppToastContainer,
  AuthCheckContainer,
  GlobalLoadingContainer,
  GoogleAnalyticsContainer,
} from '@/components/common';
import {
  AntdConfigProvider,
  IsMobileProvider,
  LoadingProvider,
  SocketProvider,
} from '@/contexts';
import { getQueryClient } from '@/utils/api';

export const queryClient = getQueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='dark'
        forcedTheme='dark'
        enableSystem={false}
      >
        <AntdRegistry>
          <IsMobileProvider>
            <SocketProvider>
              <LoadingProvider>
                <AntdConfigProvider>{children}</AntdConfigProvider>
                <AppToastContainer />
                <AuthCheckContainer />
                <GlobalLoadingContainer />
                <GoogleAnalyticsContainer />
                <ReactQueryDevtools initialIsOpen />
              </LoadingProvider>
            </SocketProvider>
          </IsMobileProvider>
        </AntdRegistry>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
