'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Checkbox, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import { HOME_PATH } from '@/constants';
import { handleErrorToast } from '@/utils';
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
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-background'>
          <div className='rounded-lg bg-background-300 border border-background-200 px-10 py-8 sm:mx-auto sm:w-full sm:max-w-sm shadow-lg'>
            <Form
              form={form}
              onFinish={onSubmit}
              layout='vertical'
              className='space-y-5'
            >
              <div className=''>
                <div className='mb-6 flex w-full flex-col content-center justify-center space-y-3'>
                  <Image
                    src='/logo.png'
                    alt='logo image'
                    height={35}
                    width={130}
                    className='mx-auto'
                  />
                  <h2 className='text-center text-2xl font-semibold text-white'>
                    Sign in to your Account
                  </h2>
                  <p className='text-center text-sm text-gray-400'>
                    Use your email to log in to your account
                  </p>
                </div>
                <Form.Item
                  label={<span className='text-gray-300'>Email</span>}
                  name={'email'}
                  rules={[{ required: true, message: 'Email is required' }]}
                >
                  <Input
                    size='large'
                    placeholder='Enter your email'
                    type='email'
                    className='bg-background-200 border-background-100 text-white placeholder-gray-500'
                  />
                </Form.Item>
              </div>
              <div className='relative'>
                <Form.Item
                  label={<span className='text-gray-300'>Password</span>}
                  name={'password'}
                  rules={[{ required: true, message: 'Password is required' }]}
                >
                  <Input.Password
                    size='large'
                    placeholder='Enter your password'
                    className='bg-background-200 border-background-100 text-white placeholder-gray-500'
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
                  <Checkbox className='text-gray-300'>Remember me</Checkbox>
                </Form.Item>
                <Link
                  className='text-primary hover:text-primary-400 hover:underline'
                  href={`/forgotpassword?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
                >
                  Forgot Password?
                </Link>
              </div>

              <Form.Item>
                <Button 
                  htmlType='submit' 
                  type='primary' 
                  className='w-full bg-primary border-primary hover:bg-primary-400 h-10'
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>

            <p className='mt-6 text-center text-sm text-gray-400'>
              {"Don't have an account? "}
              <Link
                href={`/signup?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
                className='font-medium text-primary hover:text-primary-400 hover:underline'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
