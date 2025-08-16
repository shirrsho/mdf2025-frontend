'use client';
import { IUser } from '@/interfaces';

import { Card, Typography, Tag, Button, Avatar } from 'antd';
import { Mail, Phone, Calendar } from 'lucide-react';

const { Title, Text } = Typography;

export const Profile = ({ user }: { user: IUser | undefined }) => {
  if (!user) return null;

  return (
    <div className='flex min-h-[60vh] items-center justify-center bg-background-100 py-10 dark:bg-background-dark-100'>
      <Card className='!w-full max-w-lg rounded-2xl border-0 bg-white shadow-lg dark:bg-background-dark-200'>
        <div className='flex flex-col items-center gap-4'>
          <Avatar
            size={96}
            src={user.imageUrl}
            className='border-2 border-primary-200 bg-primary-100 text-3xl font-bold shadow-md dark:border-primary-dark-200 dark:bg-primary-dark-200'
          >
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Title
            level={3}
            className='mb-0 text-center text-heading dark:text-heading-dark'
          >
            {user.name}
          </Title>
          <div className='flex flex-wrap justify-center gap-2'>
            {user.status && (
              <Tag
                color={user.status === 'active' ? 'green' : 'red'}
                className='rounded-full px-3 py-1 text-xs font-medium'
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Tag>
            )}
          </div>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <Mail className='h-4 w-4 text-primary' />
            <Text className='text-paragraph dark:text-paragraph-dark'>
              {user.email}
            </Text>
          </div>
          {user.phone && (
            <div className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-primary' />
              <Text className='text-paragraph dark:text-paragraph-dark'>
                {user.phone}
              </Text>
            </div>
          )}
          {user.createdAt && (
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-primary' />
              <Text className='text-paragraph dark:text-paragraph-dark'>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </div>
          )}
        </div>

        <div className='mt-8 flex justify-center'>
          <Button
            type='primary'
            className='rounded-lg bg-primary px-8 py-2 font-semibold text-white shadow transition-colors hover:bg-primary-600'
          >
            Edit Profile
          </Button>
        </div>
      </Card>
    </div>
  );
};
