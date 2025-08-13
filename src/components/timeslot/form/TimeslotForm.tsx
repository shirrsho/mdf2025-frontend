'use client';
import React, { useEffect } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Switch,
  Space,
  Row,
  Col,
} from 'antd';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ITimeslot, ITimeslotCreateRequest } from '@/interfaces';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface TimeslotFormProps {
  initialData?: ITimeslot;
  isEdit: boolean;
  onSubmit: (values: ITimeslotCreateRequest) => void;
  isLoading: boolean;
}

export const TimeslotForm: React.FC<TimeslotFormProps> = ({
  initialData,
  isEdit,
  onSubmit,
  isLoading,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        timeslotName: initialData.timeslotName,
        description: initialData.description,
        isAvailable: initialData.isAvailable,
        timeRange: [dayjs(initialData.startTime), dayjs(initialData.endTime)],
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: any) => {
    const { timeRange, ...rest } = values;
    const submitData: ITimeslotCreateRequest = {
      ...rest,
      startTime: timeRange[0].toISOString(),
      endTime: timeRange[1].toISOString(),
      isAvailable: values.isAvailable ?? true,
    };
    onSubmit(submitData);
  };

  return (
    <div className='min-h-screen bg-background-100 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-4xl p-6'>
        {/* Header */}
        <div className='mb-8 flex items-center gap-4'>
          <Button
            icon={<ArrowLeft className='h-4 w-4' />}
            onClick={() => router.back()}
            className='h-10 border-gray-300 text-paragraph dark:border-gray-600 dark:text-paragraph-dark'
          >
            Back
          </Button>
          <div>
            <h1 className='text-2xl font-bold text-heading dark:text-white'>
              {isEdit ? 'Edit Timeslot' : 'Create New Timeslot'}
            </h1>
            <p className='mt-1 text-paragraph dark:text-gray-200'>
              {isEdit
                ? 'Update timeslot information and schedule'
                : 'Set up a new timeslot for webinar scheduling'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card
          className='border-0 shadow-lg'
          style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
        >
          <Form
            form={form}
            layout='vertical'
            onFinish={handleSubmit}
            className='space-y-6'
            initialValues={{
              isAvailable: true,
            }}
          >
            <Row gutter={24}>
              <Col xs={24} lg={16}>
                <Form.Item
                  label={
                    <span className='text-sm font-medium text-gray-200'>
                      Timeslot Name
                    </span>
                  }
                  name='timeslotName'
                  rules={[
                    { required: true, message: 'Please enter timeslot name' },
                    { min: 3, message: 'Name must be at least 3 characters' },
                  ]}
                >
                  <Input
                    size='large'
                    placeholder='e.g., Morning Session - Day 1'
                    className='border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span className='text-sm font-medium text-gray-200'>
                      Available for Booking
                    </span>
                  }
                  name='isAvailable'
                  valuePropName='checked'
                >
                  <Switch
                    size='default'
                    checkedChildren='Available'
                    unCheckedChildren='Unavailable'
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span className='flex items-center gap-2 text-sm font-medium text-gray-200'>
                  <Clock className='h-4 w-4' />
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
                      return Promise.reject(
                        'End time must be after start time'
                      );
                    }
                    if (end.diff(start, 'minutes') < 30) {
                      return Promise.reject(
                        'Timeslot must be at least 30 minutes long'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <RangePicker
                size='large'
                showTime={{
                  format: 'HH:mm',
                  minuteStep: 15,
                }}
                format='YYYY-MM-DD HH:mm'
                placeholder={['Start Time', 'End Time']}
                className='w-full border-gray-600 bg-gray-700 text-white'
                suffixIcon={<Calendar className='h-4 w-4 text-gray-400' />}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className='text-sm font-medium text-gray-200'>
                  Description (Optional)
                </span>
              }
              name='description'
            >
              <TextArea
                rows={4}
                placeholder='Describe the purpose or context of this timeslot...'
                className='border-gray-600 bg-gray-700 text-white placeholder-gray-400'
              />
            </Form.Item>

            {/* Submit Button */}
            <div className='flex justify-end pt-6'>
              <Space>
                <Button
                  size='large'
                  onClick={() => router.back()}
                  className='h-12 border-gray-600 px-6 text-gray-300 hover:border-gray-500 hover:text-white'
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  size='large'
                  htmlType='submit'
                  loading={isLoading}
                  className='h-12 border-primary bg-primary px-8 font-medium hover:bg-primary-600'
                >
                  {isEdit ? 'Update Timeslot' : 'Create Timeslot'}
                </Button>
              </Space>
            </div>
          </Form>
        </Card>

        {/* Info Card */}
        <Card
          className='mt-6 border-0'
          style={{ backgroundColor: '#313131', borderRadius: '12px' }}
        >
          <div className='flex items-start gap-3'>
            <div className='rounded-full bg-blue-100 p-2'>
              <Clock className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <h3 className='font-medium text-gray-200'>Timeslot Guidelines</h3>
              <ul className='mt-2 space-y-1 text-sm text-gray-400'>
                <li>• Timeslots should be at least 30 minutes long</li>
                <li>
                  • Multiple webinars can be scheduled within a single timeslot
                </li>
                <li>
                  • Webinars cannot overlap in time within the same timeslot
                </li>
                <li>
                  • Use descriptive names to help distinguish between timeslots
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
