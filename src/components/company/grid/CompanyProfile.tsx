'use client';
import React from 'react';
import { Skeleton, Card, Button, Typography } from 'antd';
import { useGetCompanyById } from '@/apis';
import { CompanyDetail } from '../detail';
import { IUser } from '@/interfaces';
import { Building2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export const CompanyProfile = ({
  user,
  mode,
}: {
  user: IUser;
  mode: 'admin' | 'company';
}) => {
  const router = useRouter();
  const { data: company, isLoading } = useGetCompanyById(user?.companyId ?? '');

  if (!user || isLoading) {
    return (
      <div className='min-h-screen p-6' style={{ backgroundColor: '#232323' }}>
        <div className='mx-auto max-w-6xl'>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!user?.companyId) {
    return (
      <div
        className='flex items-center justify-center p-6'
        style={{ backgroundColor: '#232323' }}
      >
        <Card
          className='w-full max-w-md border-0 text-center shadow-lg'
          style={{ backgroundColor: '#2a2a2a', borderRadius: '16px' }}
        >
          <div className='py-8'>
            <div
              className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'
              style={{ backgroundColor: '#F4612E20' }}
            >
              <Building2 className='h-10 w-10' style={{ color: '#F4612E' }} />
            </div>

            <Title level={3} className='mb-4' style={{ color: '#F9FAFB' }}>
              No Institute Added
            </Title>

            <Text
              className='mb-6 block text-base leading-relaxed'
              style={{ color: '#D1D5DB' }}
            >
              You haven&apos;t added your institute information yet. Please add
              your institute details to get started.
            </Text>

            <Button
              type='primary'
              size='large'
              icon={<Plus className='h-4 w-4' />}
              onClick={() => router.push('/c/institute/create')}
              className='h-12 px-8 font-medium transition-all hover:scale-105'
              style={{
                backgroundColor: '#F4612E',
                borderColor: '#F4612E',
                borderRadius: '8px',
              }}
            >
              Add My Institute
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <CompanyDetail mode={mode} companyId={company?.id ?? ''} />;
};
