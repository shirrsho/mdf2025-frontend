import React from 'react';

interface LogoLoaderProps {
  className?: string;
}

export const LogoLoader = ({ className = '' }: LogoLoaderProps) => {
  return (
    <div
      className={`flex min-h-[80vh] flex-col items-center justify-center p-4 bg-background ${className}`}
    >
      <div className='relative flex flex-col items-center'>
        {/* Main spinner */}
        <div className='relative h-16 w-16'>
          <div className='absolute inset-0 rounded-full border-4 border-background-200'></div>
          <div className='absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary'></div>
        </div>
        
        {/* Inner pulse circles */}
        <div className='absolute flex items-center justify-center'>
          <div className='h-8 w-8 animate-pulse rounded-full bg-primary/20'></div>
          <div className='absolute h-4 w-4 animate-ping rounded-full bg-primary/40'></div>
        </div>
      </div>
      
      {/* Loading text with animated dots */}
      {/* <div className='mt-6 text-center'>
        <span className='text-lg font-medium text-white'>
          Loading
        </span>
        <span className='inline-flex ml-1'>
          <span className='animate-bounce text-primary' style={{ animationDelay: '0ms' }}>.</span>
          <span className='animate-bounce text-primary' style={{ animationDelay: '150ms' }}>.</span>
          <span className='animate-bounce text-primary' style={{ animationDelay: '300ms' }}>.</span>
        </span>
      </div> */}
      
      {/* Progress bar */}
      {/* <div className='mt-4 w-48 h-1 bg-background-200 rounded-full overflow-hidden'>
        <div className='h-full bg-gradient-to-r from-primary to-primary-400 animate-pulse'></div>
      </div> */}
    </div>
  );
};
