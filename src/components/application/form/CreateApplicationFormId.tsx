'use client';
import React from 'react';
import { Input, Button, Form, Space } from 'antd';
import { handleErrorToast } from '@/utils';
import {
  useCreateApplication,
  useGetApplicationById,
  useUpdateApplication,
} from '@/apis';
import { Toast } from '@/libs/toast';
import { IApplication } from '@/interfaces';
import { useRouter } from 'next/navigation';

interface ICreateApplicationForm {
  applicationId?: string;
}

export const CreateApplicationFormId: React.FC<ICreateApplicationForm> = ({
  applicationId,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { data } = useGetApplicationById(applicationId);
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();

  if (data) {
    form.setFieldsValue(data);
  }

  const handleSubmit = async (data: IApplication) => {
    try {
      if (data.id) {
        await updateApplication.mutateAsync(data);
        Toast.success('Application updated successfully!');
      } else {
        const ret = await createApplication.mutateAsync(data);
        Toast.success('Application created successfully!');
        router.push(`/admin/application/create/${ret.id}`);
      }
    } catch (error: any) {
      handleErrorToast(error);
    }
  };

  return (
    <div className='min-h-screen px-4 py-6 sm:px-6 sm:py-12 lg:px-8'>
      <div className='mx-auto max-w-4xl overflow-hidden rounded-lg shadow-2xl'>
        <div className='px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
          <h2 className='text-center text-2xl font-extrabold sm:text-4xl'>
            আপনার তথ্য যোগ দিন
          </h2>
        </div>
        <Form
          form={form}
          onFinish={handleSubmit}
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
