'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input } from 'antd';
import { Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { forgotPasswordOtp } from '@/apis';
import { HOME_PATH } from '@/constants';
import { handleErrorToast } from '@/utils';

const OTP_SIZE = 6;

interface Props {
  email: string;
  isVerifyOnly: boolean;
}

export const OTPForm: React.FC<Props> = ({ email, isVerifyOnly }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [errors, setErrors] = React.useState<string>('');

  const onSubmit = async (data: any) => {
    try {
      const otpString = Object.values(data).join('');
      const ret = await forgotPasswordOtp(email, otpString, isVerifyOnly);
      toast.success(ret?.message ?? 'OTP submitted successfully');
      if (isVerifyOnly) {
        router.push(
          `/signin?redirect=${encodeURIComponent(redirect || HOME_PATH)}`
        );
      } else {
        localStorage.setItem('userotp', otpString);
        router.push(
          `/setpassword?email=${email}&redirect=${encodeURIComponent(redirect || HOME_PATH)}`
        );
      }
    } catch (error: any) {
      handleErrorToast(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputLength = e.target.value.length;
    const nextIndex = (index % OTP_SIZE) + 1;
    if (inputLength === 1 && nextIndex !== 1) {
      setTimeout(() => {
        const nextInput = document.getElementById(
          `otp${nextIndex}`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .trim()
      .substring(0, OTP_SIZE);
    const otpDigits = pastedData.split('');
    otpDigits.forEach((digit, index) => {
      form.setFieldValue(`otp${index + 1}`, digit);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    setErrors(`Please filled ${OTP_SIZE} digit otp.`);
    console.error('Failed:', errorInfo);
  };

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='rounded-md bg-white px-10 py-6 sm:mx-auto sm:w-full sm:max-w-sm'>
        <Form
          form={form}
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          className='space-y-5'
        >
          <div className='max-w-md'>
            <div className='mb-3 flex flex-col items-center space-y-4'>
              <div className='rounded-full bg-green-50 p-3'>
                <div className='rounded-full bg-green-100 p-3'>
                  <Mail className='h-8 w-8' />
                </div>
              </div>
              <h2 className='text-2xl font-semibold'>Check your email</h2>
              <p className='text-center text-[12px]'>
                We have sent a verification code to {email}
              </p>
            </div>
            <div className='flex space-x-2'>
              {[...Array(OTP_SIZE)].map((_, index: number) => (
                <>
                  <Form.Item
                    key={index}
                    name={`otp${index + 1}`}
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      id={`otp${index + 1}`}
                      type='text'
                      maxLength={1}
                      size='large'
                      className='mt-2 flex w-1/4 items-center justify-center rounded-md border bg-white px-2 py-2 text-center text-3xl font-semibold text-[#036c3c] focus:border-2 focus:border-[#036c3c] focus:outline-none focus:ring-0'
                      onChange={(e) => handleInputChange(e, index + 1)}
                      onPaste={handlePaste}
                    />
                  </Form.Item>
                </>
              ))}
            </div>

            <p className='text-red-500'>{errors}</p>
          </div>
          <input
            type='submit'
            value='Submit'
            className='my-6 w-full transform cursor-pointer rounded-md bg-[#036c3c] px-4 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-green-600 focus:bg-gray-600 focus:outline-none'
          />
        </Form>

        <div className='relative my-6 flex w-full items-center justify-center border border-t'>
          <div className='absolute bg-gray-100 px-5 text-black'>Or</div>
        </div>

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
  );
};
