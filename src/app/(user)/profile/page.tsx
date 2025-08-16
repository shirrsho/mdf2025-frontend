'use client';
import React from 'react';
import { useGetUser } from '@/apis';

const ProfilePage = () => {
  const { data } = useGetUser();
  return <>profile of me: {data?.user?.name}</>;
};

export default ProfilePage;
