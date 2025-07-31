'use client';
import React from 'react';
import { Input, Button, Form, FormInstance, Space } from 'antd';
import { IUser } from '@/interfaces';
import { SelectRole } from '@/components/common';

interface ICreateUserForm {
  form: FormInstance;
  onFinish?: (values: IUser) => Promise<void>;
}

export const CreateUserForm: React.FC<ICreateUserForm> = ({
  form,
  onFinish,
}) => {
  return (
    <div className='min-h-screen px-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl overflow-hidden rounded-lg shadow-2xl'>
        <Form
          form={form}
          onFinish={onFinish}
          className='!space-y-4 !px-4 !py-8 sm:!space-y-6 sm:!px-6 lg:!px-8'
          layout='vertical'
        >
          <Form.Item name='id' hidden />
          <Form.Item
            label='নাম'
            name='name'
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Role'
            name='rolePermission'
            rules={[{ required: true, message: 'Role is required' }]}
          >
            <SelectRole />
          </Form.Item>

          <Space className='w-full justify-center'>
            <Button type='primary' htmlType='submit' className='py-3 text-lg'>
              সাবমিট করুন
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
};
