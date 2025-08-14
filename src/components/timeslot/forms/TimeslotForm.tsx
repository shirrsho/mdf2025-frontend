'use client';
import React from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { Save, X } from 'lucide-react';
import {
  ITimeslot,
  ITimeslotCreateRequest,
  ITimeslotUpdateRequest,
} from '@/interfaces';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface TimeslotFormProps {
  onSubmit: (data: ITimeslotCreateRequest | ITimeslotUpdateRequest) => void;
  onCancel: () => void;
  initialData?: ITimeslot;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export const TimeslotForm: React.FC<TimeslotFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  mode,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const { timeRange, ...rest } = values;

      if (!timeRange || timeRange.length !== 2) {
        message.error('Please select start and end time');
        return;
      }

      const formData = {
        ...rest,
        startTime: timeRange[0].toISOString(),
        endTime: timeRange[1].toISOString(),
      };

      await onSubmit(formData);
    } catch {
      message.error('Please check your input and try again');
    }
  };

  const initialValues = initialData
    ? {
        ...initialData,
        timeRange: [dayjs(initialData.startTime), dayjs(initialData.endTime)],
      }
    : {};

  return (
    <div className='min-h-screen bg-background-100 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-2xl p-6'>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={initialValues}
          className='space-y-6'
        >
          {/* Timeslot Name */}
          <Form.Item
            label={
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Timeslot Name
              </span>
            }
            name='timeslotName'
            rules={[
              { required: true, message: 'Please enter timeslot name' },
              { min: 3, message: 'Name must be at least 3 characters' },
              { max: 100, message: 'Name must not exceed 100 characters' },
            ]}
          >
            <Input
              placeholder='Enter timeslot name (e.g., Morning Session)'
              className='h-12 border-gray-300 text-gray-900 placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500'
            />
          </Form.Item>

          {/* Time Range */}
          <Form.Item
            label={
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Time Range
              </span>
            }
            name='timeRange'
            rules={[
              { required: true, message: 'Please select start and end time' },
              {
                validator: (_, value) => {
                  if (!value || value.length !== 2) {
                    return Promise.reject(
                      'Please select both start and end time'
                    );
                  }

                  const [start, end] = value;
                  if (end.isBefore(start)) {
                    return Promise.reject('End time must be after start time');
                  }

                  const duration = end.diff(start, 'minutes');
                  if (duration < 15) {
                    return Promise.reject('Minimum duration is 15 minutes');
                  }

                  if (duration > 480) {
                    return Promise.reject('Maximum duration is 8 hours');
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format='YYYY-MM-DD HH:mm'
              placeholder={['Start Time', 'End Time']}
              className='h-12 w-full border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              style={{ width: '100%' }}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label={
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Description
              </span>
            }
            name='description'
            rules={[
              {
                max: 500,
                message: 'Description must not exceed 500 characters',
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder='Enter a description for this timeslot (optional)'
              className='border-gray-300 text-gray-900 placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500'
            />
          </Form.Item>

          {/* Form Actions */}
          <div className='flex justify-end gap-4 pt-6'>
            <Button
              onClick={onCancel}
              className='h-12 border-gray-300 px-6 text-gray-700 hover:border-gray-400 hover:text-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white'
              icon={<X className='h-4 w-4' />}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={isLoading}
              className='h-12 border-primary bg-primary px-6 font-medium hover:bg-primary-600'
              icon={<Save className='h-4 w-4' />}
            >
              {mode === 'create' ? 'Create Timeslot' : 'Update Timeslot'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
