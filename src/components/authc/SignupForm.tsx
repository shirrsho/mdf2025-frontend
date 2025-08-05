'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Form, Input, Typography } from 'antd';
import { toast } from 'react-toastify';
import { GoogleIcons } from '@/components/common';
import { signup, useIsLoggedInQuery } from '@/apis';
import { HOME_PATH } from '@/constants';
import { handleErrorToast } from '@/utils';

const { Title, Text } = Typography;

export const SignupForm: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: isloggedin } = useIsLoggedInQuery();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const onFinish = async (values: any) => {
    delete values.confirmPassword;
    try {
      await signup(values);
      toast.success(`An email sent ${values.email}`);
      router.push(
        `/otp?email=${values.email}&t=new&redirect=${encodeURIComponent(redirect || HOME_PATH)}`
      );
    } catch (error: any) {
      handleErrorToast(error);
    }
  };

  useEffect(() => {
    if (isloggedin) {
      const redirectTo = redirect ? decodeURIComponent(redirect) : HOME_PATH;
      router.push(redirectTo);
    }
  }, [isloggedin, router, redirect]);

  return (
    <>
      {!isloggedin && (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-background'>
          <div className='rounded-lg bg-background-300 border border-background-200 px-10 py-8 sm:mx-auto sm:w-full sm:max-w-sm shadow-lg'>
            <Form form={form} onFinish={onFinish} layout='vertical'>
              <div className='mb-6 text-center'>
                <Image
                  src='/logo.png'
                  alt='logo image'
                  height={35}
                  width={130}
                  className='mx-auto mb-4'
                />
                <Title level={3} className='!text-white !mb-2'>
                  Sign up for an Account
                </Title>
                <Text className='text-gray-400'>
                  Create your account by filling out the information below
                </Text>
              </div>
              <Form.Item
                label={<span className='text-gray-300'>Name</span>}
                name='name'
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input 
                  size='large' 
                  placeholder='Enter your name'
                  className='bg-background-200 border-background-100 text-white placeholder-gray-500'
                />
              </Form.Item>
              <Form.Item
                label={<span className='text-gray-300'>Email</span>}
                name='email'
                rules={[{ required: true, message: 'Email is required' }]}
              >
                <Input
                  size='large'
                  placeholder='Enter your email'
                  type='email'
                  className='bg-background-200 border-background-100 text-white placeholder-gray-500'
                />
              </Form.Item>
              <Form.Item
                label={<span className='text-gray-300'>Password</span>}
                name='password'
                rules={[{ required: true, message: 'Password is required' }]}
              >
                <Input.Password
                  size='large'
                  placeholder='Enter your password'
                  className='bg-background-200 border-background-100 text-white placeholder-gray-500'
                />
              </Form.Item>
              <Form.Item
                label={<span className='text-gray-300'>Confirm Password</span>}
                name='confirmPassword'
                rules={[
                  {
                    required: true,
                    message: 'Confirm Password is required',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('The passwords do not match')
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size='large'
                  placeholder='Confirm your password'
                  className='bg-background-200 border-background-100 text-white placeholder-gray-500'
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type='primary' 
                  htmlType='submit' 
                  block 
                  size='large'
                  className='bg-primary border-primary hover:bg-primary-400 h-12'
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
            <div className='relative mt-6 flex w-full items-center justify-center rounded-lg border border-background-200 bg-background-200 hover:bg-background-100 transition-colors'>
              <Link
                href='/signin'
                className='flex items-center gap-x-2 py-3 text-[14px] text-gray-300 hover:text-white'
              >
                <GoogleIcons />
                Continue with Google
              </Link>
            </div>
            <p className='mt-6 text-center text-sm text-gray-400'>
              Already have an account?{' '}
              <Link
                href={`/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
                className='font-medium text-primary hover:text-primary-400 hover:underline'
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
