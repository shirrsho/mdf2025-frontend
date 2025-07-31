import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div
      role='status'
      className='fixed left-0 top-0 flex h-[100vh] w-full items-center justify-center bg-white'
    >
      <div className='h-10 w-10 animate-spin rounded-full border-b-4 border-blue-500'></div>
    </div>
  );
};
