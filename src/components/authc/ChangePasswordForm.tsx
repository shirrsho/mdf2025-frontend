'use client';
import React, { useState } from 'react';
import { Button, Form, Input, Typography, Steps, Alert } from 'antd';
import { Key, Mail, Shield } from 'lucide-react';
import { Toast } from '@/libs/toast';
import {
  forgetPassword,
  forgotPasswordOtp,
  forgotPasswordOtpNewPassword,
} from '@/apis/auth';
import { useGetUser } from '@/apis/auth';
import { handleErrorToast } from '@/utils';

const { Title, Text } = Typography;
const { Step } = Steps;

interface ChangePasswordFormData {
  password: string;
  confirmPassword: string;
}

interface OTPFormData {
  otp: string;
}

export const ChangePasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userEmail, setUserEmail] = useState<string>('');

  const { data: userData } = useGetUser();

  const sendOTP = async () => {
    if (!userData?.user?.email) {
      Toast.error('User email not found');
      return;
    }

    try {
      setLoading(true);
      const response = await forgetPassword(userData.user.email);
      setUserEmail(userData.user.email);
      Toast.success(response.message);
      setCurrentStep(1);
    } catch (error: any) {
      handleErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (values: OTPFormData) => {
    try {
      setLoading(true);
      await forgotPasswordOtp(userEmail, values.otp, false);
      Toast.success('OTP verified successfully');
      setCurrentStep(2);
    } catch (error: any) {
      handleErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (values: ChangePasswordFormData) => {
    const otpValue = otpForm.getFieldValue('otp');
    if (!otpValue) {
      Toast.error('OTP verification required');
      return;
    }

    try {
      setLoading(true);
      await forgotPasswordOtpNewPassword(userEmail, otpValue, values.password);
      Toast.success('Password changed successfully');

      // Reset all forms and go back to step 0
      form.resetFields();
      otpForm.resetFields();
      setCurrentStep(0);
      setUserEmail('');
    } catch (error: any) {
      handleErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='space-y-6'>
            <Alert
              message='Security Verification Required'
              description={`We'll send an OTP to ${userData?.user?.email} to verify your identity before changing your password.`}
              type='info'
              showIcon
              className='mb-6'
            />
            <Button
              type='primary'
              size='large'
              onClick={sendOTP}
              loading={loading}
              block
              className='h-12 border-primary bg-primary font-medium text-white hover:border-primary-600 hover:bg-primary-600'
            >
              Send OTP to My Email
            </Button>
          </div>
        );

      case 1:
        return (
          <Form
            form={otpForm}
            onFinish={verifyOTP}
            layout='vertical'
            className='space-y-4'
          >
            <Alert
              message='OTP Sent'
              description={`Please check your email ${userEmail} and enter the OTP below.`}
              type='success'
              showIcon
              className='mb-6'
            />

            <Form.Item
              name='otp'
              label={
                <span className='font-medium text-heading dark:text-heading-dark'>
                  Enter OTP
                </span>
              }
              rules={[
                { required: true, message: 'Please enter the OTP' },
                { len: 6, message: 'OTP must be 6 digits' },
              ]}
            >
              <Input
                size='large'
                prefix={<Shield className='h-4 w-4 text-gray-400' />}
                placeholder='Enter 6-digit OTP'
                maxLength={6}
                className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
              />
            </Form.Item>

            <div className='flex space-x-3'>
              <Button
                size='large'
                onClick={() => setCurrentStep(0)}
                className='h-12 flex-1 border-background-200 bg-white text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-paragraph-dark'
              >
                Back
              </Button>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                loading={loading}
                className='h-12 flex-1 border-primary bg-primary font-medium text-white hover:border-primary-600 hover:bg-primary-600'
              >
                Verify OTP
              </Button>
            </div>
          </Form>
        );

      case 2:
        return (
          <Form
            form={form}
            onFinish={changePassword}
            layout='vertical'
            className='space-y-4'
          >
            <Alert
              message='OTP Verified'
              description='Now you can set your new password.'
              type='success'
              showIcon
              className='mb-6'
            />

            <Form.Item
              name='password'
              label={
                <span className='font-medium text-heading dark:text-heading-dark'>
                  New Password
                </span>
              }
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                size='large'
                prefix={<Key className='h-4 w-4 text-gray-400' />}
                placeholder='Enter new password'
                className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
              />
            </Form.Item>

            <Form.Item
              name='confirmPassword'
              label={
                <span className='font-medium text-heading dark:text-heading-dark'>
                  Confirm New Password
                </span>
              }
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
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
                prefix={<Key className='h-4 w-4 text-gray-400' />}
                placeholder='Confirm new password'
                className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
              />
            </Form.Item>

            <div className='flex space-x-3'>
              <Button
                size='large'
                onClick={() => setCurrentStep(1)}
                className='h-12 flex-1 border-background-200 bg-white text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-paragraph-dark'
              >
                Back
              </Button>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                loading={loading}
                className='h-12 flex-1 border-primary bg-primary font-medium text-white hover:border-primary-600 hover:bg-primary-600'
              >
                Update Password
              </Button>
            </div>
          </Form>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 0:
        return <Mail className='h-4 w-4' />;
      case 1:
        return <Shield className='h-4 w-4' />;
      case 2:
        return <Key className='h-4 w-4' />;
      default:
        return null;
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='mb-6 flex flex-col items-center space-y-4'>
        <div className='rounded-full bg-primary/20 p-3'>
          <div className='rounded-full bg-primary/30 p-3'>
            <Key className='h-8 w-8 text-primary' />
          </div>
        </div>
        <Title level={4} className='!mb-2 text-heading dark:text-heading-dark'>
          Change Password
        </Title>
        <Text className='text-center text-paragraph dark:text-paragraph-dark'>
          Secure password change with email verification
        </Text>
      </div>

      <div className='mb-8'>
        <Steps current={currentStep} size='small' className='mb-6'>
          <Step
            title='Send OTP'
            icon={getStepIcon(0)}
            description='Verify email'
          />
          <Step
            title='Verify OTP'
            icon={getStepIcon(1)}
            description='Enter code'
          />
          <Step
            title='New Password'
            icon={getStepIcon(2)}
            description='Update password'
          />
        </Steps>
      </div>

      {renderStepContent()}
    </div>
  );
};
