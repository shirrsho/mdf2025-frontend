'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Form, Input, Typography } from 'antd';
import { Key, MoveLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { forgetPassword } from '@/apis';
import { HOME_PATH } from '@/constants';
import { handleErrorToast } from '@/utils';

const { Title, Text, Link } = Typography;

export const ForgotPasswordForm: React.FC<object> = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      const res = await forgetPassword(values.email);
      toast.success(res.message);
      router.push(
        `/otp?email=${values.email}&redirect=${encodeURIComponent(redirect || HOME_PATH)}`
      );
    } catch (error: any) {
      handleErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 bg-background-300 border border-background-200 px-8 py-10 shadow-lg sm:rounded-lg sm:px-12'>
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <div className='mb-6 flex flex-col items-center space-y-4'>
          <div className='rounded-full bg-primary/20 p-3'>
            <div className='rounded-full bg-primary/30 p-3'>
              <Key className='h-8 w-8 text-primary' />
            </div>
          </div>
          <Title level={2} className='!text-white !mb-2'>
            Forgot Password
          </Title>
          <Text className='text-gray-400 text-center'>
            Please enter your email address to reset your password
          </Text>
        </div>
        <Form.Item
          name='email'
          label={<span className='text-gray-300'>Email</span>}
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input 
            type='email' 
            autoComplete='email' 
            size='large'
            className='bg-background-200 border-background-100 text-white placeholder-gray-500'
            placeholder='Enter your email address'
          />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            size='large'
            htmlType='submit'
            loading={loading}
            block
            className='bg-primary border-primary hover:bg-primary-400 h-12'
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
      <Link
        href={`/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
        className='flex items-center justify-center text-gray-400 hover:text-primary transition-colors'
      >
        <MoveLeft className='mr-2 h-4 w-4' />
        Back to sign in
      </Link>
    </div>
  );
};
