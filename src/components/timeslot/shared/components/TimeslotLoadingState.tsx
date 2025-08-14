import React from 'react';

interface TimeslotLoadingStateProps {
  message?: string;
}

export const TimeslotLoadingState: React.FC<TimeslotLoadingStateProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-900'>
      <div className='text-lg text-gray-200'>{message}</div>
    </div>
  );
};
