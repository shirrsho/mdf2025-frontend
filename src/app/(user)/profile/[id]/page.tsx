'use client';
import React from 'react';
import { useGetUserById } from '@/apis';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  const userId = params.id;
  const { data } = useGetUserById(userId);
  return <>profile of {data?.name}</>;
};

export default ProfilePage;
