'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type IsMobileContextType = {
  isMobile: boolean;
};

const IsMobileContext = createContext<IsMobileContextType>({
  isMobile: false,
});

type Props = { children: React.ReactNode };

export const IsMobileProvider = (props: Props) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const checkIfMobile = () => {
    const isMobileDevice = window.innerWidth <= 768;
    setIsMobile(isMobileDevice);
  };

  useEffect(() => {
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <IsMobileContext.Provider value={{ isMobile }}>
      {props.children}
    </IsMobileContext.Provider>
  );
};

export function useIsMobile() {
  const context = useContext(IsMobileContext);
  if (!context) {
    throw new Error('useIsMobile must be used within an IsMobileProvider');
  }
  return context;
}
