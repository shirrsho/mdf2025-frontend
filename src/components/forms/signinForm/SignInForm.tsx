'use client';
import { HOME_PATH } from '@/constants';
import { handleErrorToast } from '@/utils';
import { Button, Checkbox, Form, Input } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { signin, useIsLoggedInQuery } from '@/apis';

export const SignInForm: React.FC = () => {
  const router = useRouter();
  const { data: isloggedin } = useIsLoggedInQuery();
  const [form] = Form.useForm();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const onSubmit = async (data: any) => {
    try {
      await signin(data);
      toast.success('Login successful');
      const redirectTo = redirect ? decodeURIComponent(redirect) : HOME_PATH;
      router.push(redirectTo);
    } catch (error: any) {
      if (error.response?.data?.message === 'User not verified') {
        router.push(
          `/otp?email=${data.email}&t=new&redirect=${encodeURIComponent(redirect || HOME_PATH)}`
        );
      }
      handleErrorToast(error);
      console.log(error);
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
      {isloggedin === false && (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
          <div className='rounded-md bg-white px-10 py-6 sm:mx-auto sm:w-full sm:max-w-sm'>
            <Form
              form={form}
              onFinish={onSubmit}
              layout='vertical'
              className='space-y-5'
            >
              <div className=''>
                <div className='mb-3 flex w-full flex-col content-center justify-center space-y-2'>
                  <Image
                    src='/logo.png'
                    alt='logo image'
                    height={35}
                    width={130}
                    className='mx-auto'
                  />
                  <h2 className='text-center text-2xl font-semibold'>
                    Sign in to your Account
                  </h2>
                  <p className='text-center text-sm text-gray-500'>
                    Use your email to log in to your account
                  </p>
                </div>
                <Form.Item
                  label='Email'
                  name={'email'}
                  rules={[{ required: true, message: 'Email is required' }]}
                >
                  <Input
                    size='large'
                    placeholder='Enter your email'
                    type='email'
                  />
                </Form.Item>
              </div>
              <div className='relative'>
                <Form.Item
                  label='Password'
                  name={'password'}
                  rules={[{ required: true, message: 'Password is required' }]}
                >
                  <Input.Password
                    size='large'
                    placeholder='Enter your password'
                  />
                </Form.Item>
              </div>

              <div className='flex items-center justify-between'>
                <Form.Item
                  noStyle
                  name={'rememberMe'}
                  className='flex flex-row'
                  valuePropName='checked'
                >
                  <Checkbox className='!text-gray1'>Remember me</Checkbox>
                </Form.Item>
                <Link
                  className='text-blue-600 hover:underline'
                  href={`/forgotpassword?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
                >
                  Forgot Password?
                </Link>
              </div>

              <Form.Item>
                <Button htmlType='submit' type='primary' className='w-full'>
                  Submit
                </Button>
              </Form.Item>
            </Form>

            <p className='mt-4 text-center text-sm text-gray-700'>
              {'Create an account '}
              <Link
                href={`/signup?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
                className='font-medium text-blue-600 hover:underline'
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
