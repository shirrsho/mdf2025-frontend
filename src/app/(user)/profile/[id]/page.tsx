'use client';
import React from 'react';
import { useGetUserById } from '@/apis';
import { Profile } from '@/components/user';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  const userId = params.id;
  const { data } = useGetUserById(userId);
  return <Profile user={data} />;
};

export default ProfilePage;
