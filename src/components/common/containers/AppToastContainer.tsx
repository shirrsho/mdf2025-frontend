import React from 'react';
import { Toaster } from 'react-hot-toast';

export const AppToastContainer: React.FC = () => {
  return (
    <Toaster
      position='bottom-center'
      reverseOrder={false}
      gutter={8}
      containerClassName=''
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        // Success toasts
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
          style: {
            background: '#10B981',
            color: '#FFFFFF',
          },
        },
        // Error toasts
        error: {
          duration: 6000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
          },
        },
        // Loading toasts
        loading: {
          duration: Infinity,
        },
      }}
    />
  );
};
