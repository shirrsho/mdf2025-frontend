'use client';
import React from 'react';
import { useGetUser } from '@/apis';
import { Profile } from '@/components/user';

const ProfilePage = () => {
  const { data } = useGetUser();
  return <Profile user={data?.user} />;
};

export default ProfilePage;
