import React from 'react';
import { useLoadingContext } from '@/contexts';
import { LogoLoader } from '../loaders';

export const GlobalLoadingContainer = () => {
  const { isLoadingGlobal } = useLoadingContext();

  return (
    <>
      {isLoadingGlobal ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: isLoadingGlobal ? 1 : 0,
          }}
        >
          <LogoLoader />
        </div>
      ) : null}
    </>
  );
};
