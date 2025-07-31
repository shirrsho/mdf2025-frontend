'use client';
import React from 'react';
import { Input, Button, Form, FormInstance, Space } from 'antd';
import { IMailCredential } from '@/interfaces';

interface ICreateTemplateForm {
  form: FormInstance;
  onFinish?: (values: IMailCredential) => Promise<void>;
}

export const CreateEmailCredentialsForm: React.FC<ICreateTemplateForm> = ({
  form,
  onFinish,
}) => {
  return (
    <div className='min-h-screen px-4 py-6 sm:px-6 sm:py-12 lg:px-8'>
      <div className='mx-auto max-w-4xl overflow-hidden rounded-lg shadow-2xl'>
        <div className='px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
          <h2 className='text-center text-2xl font-extrabold sm:text-4xl'>
            Email credential
          </h2>
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          className='!space-y-4 !px-4 !py-8 sm:!space-y-6 sm:!px-6 lg:!px-8'
          layout='vertical'
        >
          <Form.Item name='id' hidden />
          <Form.Item name='_id' hidden />
          <Form.Item
            label='Name'
            name='transporterName'
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Host'
            name='smtpHost'
            rules={[{ required: true, message: 'Host is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Port'
            name='smtpPort'
            rules={[{ required: true, message: 'Port is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='From email'
            name='smtpFrom'
            rules={[
              {
                required: true,
                type: 'email',
                message: 'From email is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='User email'
            name='smtpUser'
            rules={[
              {
                required: true,
                type: 'email',
                message: 'User email is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Password'
            name='smtpPassword'
            rules={[
              {
                required: true,
                message: 'Password is required',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Space className='w-full justify-center'>
            <Button type='primary' htmlType='submit' className='py-3 text-lg'>
              Submit
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
};
