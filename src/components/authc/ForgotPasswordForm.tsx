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
    <div className='space-y-6 bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <div className='mb-3 flex flex-col items-center space-y-4'>
          <div className='rounded-full bg-green-50 p-3'>
            <div className='rounded-full bg-green-100 p-3'>
              <Key className='h-8 w-8' />
            </div>
          </div>
          <Title level={2}>Forgot Password</Title>
          <Text type='secondary'>
            Please enter your email address to reset your password
          </Text>
        </div>
        <Form.Item
          name='email'
          label='Email'
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input type='email' autoComplete='email' size='large' />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            size='large'
            htmlType='submit'
            loading={loading}
            block
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
      <Link
        href={`/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
        className='flex items-center justify-center'
      >
        <MoveLeft className='mr-1' />
        Back to sign in
      </Link>
    </div>
  );
};
