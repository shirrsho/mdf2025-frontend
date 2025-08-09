'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import { Key, ArrowLeft } from 'lucide-react';
import { forgotPasswordOtpNewPassword } from '@/apis';
import { HOME_PATH } from '@/constants';
import { handleErrorToast } from '@/utils';

interface Props {
  email: string;
}

export const SetPasswordForm: React.FC<Props> = ({ email }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [otp, setOtp] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localotp = window.localStorage.getItem('userotp') ?? '394413';
      setOtp(localotp);
    }
  }, []);

  const onSubmit = async (data: any) => {
    if (!otp) {
      toast.error('OTP not found');
      return;
    }
    try {
      const ret = await forgotPasswordOtpNewPassword(email, otp, data.password);
      toast.success(ret?.message ?? 'Password updated successfuly');
      localStorage.removeItem('userotp');
      router.push(
        `/success?redirect=${encodeURIComponent(redirect || HOME_PATH)}`
      );
    } catch (error: any) {
      localStorage.removeItem('userotp');
      handleErrorToast(error);
    }
  };

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='rounded-lg border border-background-200 bg-background-300 px-10 py-8 shadow-lg sm:mx-auto sm:w-full sm:max-w-sm'>
        <Form form={form} onFinish={onSubmit} layout='vertical'>
          <div className='max-w-md'>
            <div className='mb-6 flex flex-col items-center space-y-4'>
              <div className='rounded-full bg-primary/20 p-3'>
                <div className='rotate-180 rounded-full bg-primary/30 p-3'>
                  <Key className='h-8 w-8 text-primary' />
                </div>
              </div>
              <h2 className='text-2xl font-semibold text-white'>
                Set New Password
              </h2>
              <p className='px-2 text-center text-sm text-gray-400'>
                {`Your new password must be different to previously used passwords.`}
              </p>
            </div>
            <div className='relative'>
              <Form.Item
                label={<span className='text-gray-300'>New password</span>}
                name='password'
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password
                  placeholder='Password'
                  size='large'
                  className='mt-2 block w-full rounded-md border border-background-100 bg-background-200 px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-0'
                />
              </Form.Item>
            </div>
            <div className='relative'>
              <Form.Item
                label={<span className='text-gray-300'>Confirm Password</span>}
                name='confirmPassword'
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
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
                  placeholder='Confirm Password'
                  size='large'
                  className='mt-2 block w-full rounded-md border border-background-100 bg-background-200 px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-0'
                />
              </Form.Item>
            </div>
          </div>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              className='w-full transform cursor-pointer rounded-md border-primary bg-primary px-4 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-primary-400 focus:bg-primary-500 focus:outline-none'
            >
              Set Password
            </Button>
          </Form.Item>
        </Form>
        <p className='mt-6 text-center text-sm text-gray-400'>
          <Link
            href={`/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
            className='flex items-center justify-center font-medium text-gray-400 transition-colors hover:text-primary hover:underline'
          >
            <ArrowLeft className='mr-2 h-4 w-4' /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
