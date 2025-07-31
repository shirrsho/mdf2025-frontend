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
      <div className='rounded-md bg-white px-10 py-6 sm:mx-auto sm:w-full sm:max-w-sm'>
        <Form form={form} onFinish={onSubmit} layout='vertical'>
          <div className='max-w-md'>
            <div className='mb-3 flex flex-col items-center space-y-4'>
              <div className='rounded-full bg-green-50 p-3'>
                <div className='rotate-180 rounded-full bg-green-100 p-3'>
                  <Key className='h-8 w-8' />
                </div>
              </div>
              <h2 className='text-2xl font-semibold'>Set New Password</h2>
              <p className='px-2 text-center text-[14px] text-gray-500'>
                {`  Your new password must be different to previously used passwords.`}
              </p>
            </div>
            <div className='relative'>
              <Form.Item
                label='New password'
                name='password'
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password
                  placeholder='Password'
                  size='large'
                  className='mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-[#036c3c] focus:outline-none focus:ring-0'
                />
              </Form.Item>
            </div>
            <div className='relative'>
              <Form.Item
                label='Confirm Password'
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
                  className='mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-700 focus:border-[#036c3c] focus:outline-none focus:ring-0'
                />
              </Form.Item>
            </div>
          </div>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              className='w-full transform cursor-pointer rounded-md px-4 tracking-wide text-white transition-colors duration-200 hover:bg-green-600 focus:bg-gray-600 focus:outline-none'
            >
              Set Password
            </Button>
          </Form.Item>
        </Form>
        <p className='mt-4 text-center text-sm text-gray-700'>
          <Link
            href={`/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`}
            className='flex items-center justify-center font-medium text-gray-500 hover:text-gray-700 hover:underline'
          >
            <ArrowLeft className='mr-1 mt-1 h-4 w-4' /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
