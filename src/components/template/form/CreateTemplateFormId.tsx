'use client';
import React from 'react';
import { Input, Button, Form, Space } from 'antd';
import { handleErrorToast } from '@/utils';
import {
  useCreateTemplate,
  useGetTemplateById,
  useUpdateTemplate,
} from '@/apis';
import { toast } from 'react-toastify';
import { ITemplate } from '@/interfaces';
import { useRouter } from 'next/navigation';

interface ICreateTemplateForm {
  templateId?: string;
}

export const CreateTemplateFormId: React.FC<ICreateTemplateForm> = ({
  templateId,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { data } = useGetTemplateById(templateId);
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  if (data) {
    form.setFieldsValue(data);
  }

  const handleSubmit = async (data: ITemplate) => {
    try {
      if (data.id) {
        await updateTemplate.mutateAsync(data);
        toast.success('Template updated successfully!');
      } else {
        const ret = await createTemplate.mutateAsync(data);
        toast.success('Template created successfully!');
        router.push(`/admin/template/create/${ret.id}`);
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
