'use client';
import React, { createContext, useContext, useState } from 'react';

type LoadingContextType = {
  isLoadingGlobal: boolean;
  setIsLoadingGlobal: (isLoading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoadingGlobal: false,
  setIsLoadingGlobal: () => {},
});

type Props = { children: React.ReactNode };

export const LoadingProvider = (props: Props) => {
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoadingGlobal, setIsLoadingGlobal }}>
      {props.children}
    </LoadingContext.Provider>
  );
};

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('Loading context must be used within an Loading provider');
  }
  return context;
}
