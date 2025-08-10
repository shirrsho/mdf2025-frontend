'use client';
import React, { useState } from 'react';
import { Button, Card, notification, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import {
  useGetCompanyById,
  useCreateCompany,
  useUpdateCompany,
  useGetUser,
} from '@/apis';
import { handleErrorToast } from '@/utils';
import { CompanyForm } from './CompanyForm';
import { ArrowLeft, Building2, Shield } from 'lucide-react';

const { Title, Text } = Typography;

interface ICreateCompanyFormId {
  companyId?: string;
  mode: 'admin' | 'company';
}

export const CreateCompanyFormId: React.FC<ICreateCompanyFormId> = ({
  companyId,
  mode,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const { data: companyData, isLoading: companyLoading } =
    useGetCompanyById(companyId);
  const { data: userData } = useGetUser();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      let result = null;

      if (!!companyId && companyData?.id) {
        result = await updateCompany.mutateAsync({
          id: companyData.id,
          ...values,
        });
        notification.success({
          message: 'Success',
          description: 'Company updated successfully!',
          placement: 'topRight',
        });
      } else {
        result = await createCompany.mutateAsync(values);
        notification.success({
          message: 'Success',
          description: 'Company created successfully!',
          placement: 'topRight',
        });
      }

      router.push(
        mode === 'admin'
          ? `/admin/companies/${result?.id}`
          : `/c/institute/${result?.id}`
      );
    } catch (error) {
      handleErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (companyLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading company details...
        </div>
      </div>
    );
  }

  if (mode === 'company' && !!companyId && userData?.user?.companyId) {
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
              style={{ backgroundColor: '#ef444420' }}
            >
              <Shield className='h-10 w-10' style={{ color: '#ef4444' }} />
            </div>

            <Title level={3} className='mb-4' style={{ color: '#F9FAFB' }}>
              Access Restricted
            </Title>

            <Text
              className='mb-6 block text-base leading-relaxed'
              style={{ color: '#D1D5DB' }}
            >
              You already have a company profile associated with your account.
              You can only create one company profile per account.
            </Text>

            <div className='space-y-3'>
              <Button
                type='primary'
                size='large'
                icon={<Building2 className='h-4 w-4' />}
                onClick={() => router.push('/c/institute')}
                className='h-12 w-full font-medium transition-all hover:scale-105'
                style={{
                  backgroundColor: '#F4612E',
                  borderColor: '#F4612E',
                  borderRadius: '8px',
                }}
              >
                View Your Company
              </Button>

              <Button
                size='large'
                icon={<ArrowLeft className='h-4 w-4' />}
                onClick={() => router.back()}
                className='h-12 w-full font-medium transition-all hover:scale-105'
                style={{
                  backgroundColor: '#313131',
                  borderColor: '#4d4d4d',
                  color: '#D1D5DB',
                  borderRadius: '8px',
                }}
              >
                Go Back
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <CompanyForm
      initialData={companyData}
      isEdit={!!companyId}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
