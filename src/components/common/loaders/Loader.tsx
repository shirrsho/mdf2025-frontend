import React from 'react';


export const Loader = () => {
  return (

      <div className='relative w-full flex flex-col items-center'>
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
      
  );
};
