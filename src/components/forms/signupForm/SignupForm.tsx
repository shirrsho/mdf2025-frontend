'use client';
import { signup, useIsLoggedInQuery } from '@/apis';
import { GoogleIcons } from '@/components/common/svg';
import { HOME_PATH } from '@/constants';
import { handleErrorToast } from '@/utils';
import { Button, Form, Input, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { Toast } from '@/libs/toast';
import 'react-toastify/dist/ReactToastify.css';

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
      Toast.success(`An email sent ${values.email}`);
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
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
          <div className='rounded-md bg-white px-10 py-6 sm:mx-auto sm:w-full sm:max-w-sm'>
            <Form form={form} onFinish={onFinish} layout='vertical'>
              <div className='mb-3 text-center'>
                <Image
                  src='/logo.png'
                  alt='logo image'
                  height={35}
                  width={130}
                  className='mx-auto'
                />
                <Title level={3}>Sign up for an Account</Title>
                <Text>
                  Create your account by filling out the information below
                </Text>
              </div>
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input size='large' placeholder='Enter your name' />
              </Form.Item>
              <Form.Item
                label='Email'
                name='email'
                rules={[{ required: true, message: 'Email is required' }]}
              >
                <Input
                  size='large'
                  placeholder='Enter your email'
                  type='email'
                />
              </Form.Item>
              <Form.Item
                label='Password'
                name='password'
                rules={[{ required: true, message: 'Password is required' }]}
              >
                <Input.Password
                  size='large'
                  placeholder='Enter your password'
                />
              </Form.Item>
              <Form.Item
                label='Confirm Password'
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
                />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit' block size='large'>
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
            <div className='relative mt-6 flex w-full items-center justify-center rounded-md border border-t'>
              <Link
                href='/signin'
                className='flex items-center gap-x-2 py-2 text-[14px] text-gray-500'
              >
                <GoogleIcons />
                Continue with Google
              </Link>
            </div>
            <p className='mt-4 text-center text-sm text-gray-700'>
              Already have an account?{' '}
              <Link
                href={`/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
                className='font-medium text-blue-600 hover:underline'
              >
                SignIn
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
