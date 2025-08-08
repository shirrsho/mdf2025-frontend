'use client';
import React from 'react';
import { Input, Button, Form, Space } from 'antd';
import { handleErrorToast } from '@/utils';
import {
  useCreateJob,
  useGetJobById,
  useUpdateJob,
} from '@/apis';
import { toast } from 'react-toastify';
import { IJob } from '@/interfaces';
import { useRouter } from 'next/navigation';

interface ICreateJobForm {
  jobId?: string;
}

export const CreateJobFormId: React.FC<ICreateJobForm> = ({
  jobId,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { data } = useGetJobById(jobId);
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  if (data) {
    form.setFieldsValue(data);
  }

  const handleSubmit = async (data: IJob) => {
    try {
      if (data.id) {
        await updateJob.mutateAsync(data);
        toast.success('Job updated successfully!');
      } else {
        const ret = await createJob.mutateAsync(data);
        toast.success('Job created successfully!');
        router.push(`/admin/job/create/${ret.id}`);
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
