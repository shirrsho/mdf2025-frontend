'use client';
import React, { useEffect } from 'react';
// import { getOptionalUser } from '@/apis';

export const AuthCheckContainer: React.FC = () => {
  const checkAuth = async () => {
    try {
      // await getOptionalUser();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  return <div className='hidden' />;
};
