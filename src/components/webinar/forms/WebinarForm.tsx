'use client';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  message,
  Card,
  Row,
  Col,
  Divider,
  Typography,
  Space,
} from 'antd';
import { ArrowLeft, Upload as UploadIcon, Link } from 'lucide-react';
import {
  IWebinar,
  IWebinarCreateRequest,
  IWebinarUpdateRequest,
  WebinarStatus,
} from '@/interfaces';
import { useGetTimeslotOption } from '@/apis/timeslot';
import { useGetCompanyOption } from '@/apis/company';
import { TimeSlotPicker } from './TimeSlotPicker';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

interface WebinarFormProps {
  onSubmit: (data: IWebinarCreateRequest | IWebinarUpdateRequest) => void;
  onCancel: () => void;
  initialData?: IWebinar;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export const WebinarForm: React.FC<WebinarFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  mode,
}) => {
  const [form] = Form.useForm();
  const [selectedTimeslotId, setSelectedTimeslotId] = useState<
    string | undefined
  >();
  const [timeSlotData, setTimeSlotData] = useState<{
    scheduledStartTime?: string;
    duration?: number;
  }>({});

  // Load options
  const { data: timeslotOptions } = useGetTimeslotOption();
  const { data: companyOptions } = useGetCompanyOption();

  const handleSubmit = async (values: any) => {
    try {
      // Validate that time slots are selected
      if (!timeSlotData.scheduledStartTime || !timeSlotData.duration) {
        message.error('Please select time slots for the webinar');
        return;
      }

      const formData = {
        ...values,
        scheduledStartTime: timeSlotData.scheduledStartTime,
        duration: timeSlotData.duration,
      };

      await onSubmit(formData);
    } catch {
      message.error('Please check your input and try again');
    }
  };

  const initialValues = initialData
    ? {
        ...initialData,
      }
    : {
        status: WebinarStatus.SCHEDULED,
        maxParticipants: 100,
      };

  // Update timeSlotData and selectedTimeslotId when initialData changes
  useEffect(() => {
    if (initialData) {
      setSelectedTimeslotId(initialData.timeslot?.id);
      setTimeSlotData({
        scheduledStartTime: initialData.scheduledStartTime
          ? typeof initialData.scheduledStartTime === 'string'
            ? initialData.scheduledStartTime
            : initialData.scheduledStartTime.toISOString()
          : undefined,
        duration: initialData.duration,
      });
    }
  }, [initialData]);

  const statusOptions = [
    { label: 'Scheduled', value: WebinarStatus.SCHEDULED },
    { label: 'Live', value: WebinarStatus.LIVE },
    { label: 'Completed', value: WebinarStatus.COMPLETED },
    { label: 'Cancelled', value: WebinarStatus.CANCELLED },
  ];

  const handleTimeslotChange = (value: string) => {
    setSelectedTimeslotId(value);
    // Reset time slot selection when timeslot changes
    setTimeSlotData({});
  };

  const handleTimeSlotPickerChange = (
    value: { scheduledStartTime: string; duration: number } | undefined
  ) => {
    if (value) {
      setTimeSlotData(value);
    } else {
      setTimeSlotData({});
    }
  };

  return (
    <div className='min-h-screen bg-background-100 py-8 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-4xl px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            icon={<ArrowLeft className='h-4 w-4' />}
            onClick={onCancel}
            className='mb-4 border-background-200 text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:text-paragraph-dark dark:hover:border-background-dark-200 dark:hover:text-heading-dark'
          >
            Back to Webinars
          </Button>
          <div className='flex items-center justify-between'>
            <div>
              <Title
                level={2}
                className='mb-2 text-heading dark:text-heading-dark'
              >
                {mode === 'create' ? 'Create New Webinar' : 'Edit Webinar'}
              </Title>
              <Text className='text-lg text-paragraph dark:text-paragraph-dark'>
                {mode === 'create'
                  ? 'Schedule a new webinar session for participants'
                  : 'Update webinar information and details'}
              </Text>
            </div>
          </div>
        </div>

        <Card className='border-0 bg-white shadow-lg dark:bg-background-dark-200'>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleSubmit}
            initialValues={initialValues}
            className='space-y-6'
          >
            {/* Basic Information Section */}
            <div>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-dark-200 dark:text-primary-dark-300'>
                  1
                </span>
                Basic Information
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24}>
                  <Form.Item
                    name='title'
                    label={
                      <span className='font-medium text-heading dark:text-heading-dark'>
                        Webinar Title
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please enter webinar title',
                      },
                      {
                        min: 5,
                        message: 'Title must be at least 5 characters',
                      },
                      {
                        max: 200,
                        message: 'Title must not exceed 200 characters',
                      },
                    ]}
                  >
                    <Input
                      size='large'
                      placeholder='e.g. Advanced React Development Workshop'
                      className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name='description'
                    label={
                      <span className='font-medium text-heading dark:text-heading-dark'>
                        Description
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please enter webinar description',
                      },
                      {
                        min: 20,
                        message: 'Description must be at least 20 characters',
                      },
                      {
                        max: 1000,
                        message: 'Description must not exceed 1000 characters',
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder='Describe the webinar content, objectives, and what participants will learn'
                      className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider className='my-8 border-background-200 dark:border-background-dark-300' />

            {/* Scheduling Section */}
            <div>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-900 dark:text-primary-400'>
                  2
                </span>
                Scheduling & Time Slots
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name='host'
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Host Company
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please select host company',
                      },
                    ]}
                  >
                    <Select
                      size='large'
                      placeholder='Select host company'
                      className='rounded-lg'
                    >
                      {companyOptions?.map((company: any) => (
                        <Option key={company.value} value={company.value}>
                          {company.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} lg={12}>
                  <Form.Item
                    name='timeslot'
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Timeslot
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please select timeslot' },
                    ]}
                  >
                    <Select
                      size='large'
                      placeholder='Select timeslot'
                      className='rounded-lg'
                      onChange={handleTimeslotChange}
                    >
                      {timeslotOptions?.map((timeslot: any) => (
                        <Option key={timeslot.value} value={timeslot.value}>
                          {timeslot.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Time Slots & Duration
                      </span>
                    }
                    required
                  >
                    <div className='rounded-lg border border-background-200 bg-white p-4 dark:border-background-dark-300 dark:bg-background-dark-100'>
                      <TimeSlotPicker
                        value={timeSlotData}
                        onChange={handleTimeSlotPickerChange}
                        timeslotId={selectedTimeslotId}
                        disabled={!selectedTimeslotId}
                      />
                      {!selectedTimeslotId && (
                        <div className='mt-1 text-xs text-gray-400'>
                          Please select a timeslot first
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider className='my-8 border-background-200 dark:border-background-dark-300' />

            {/* Additional Settings Section */}
            <div>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-900 dark:text-primary-400'>
                  3
                </span>
                Additional Settings
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} lg={8}>
                  <Form.Item
                    name='maxParticipants'
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Max Participants
                      </span>
                    }
                  >
                    <InputNumber
                      size='large'
                      min={1}
                      max={1000}
                      placeholder='100'
                      className='w-full rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={8}>
                  <Form.Item
                    name='category'
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Category
                      </span>
                    }
                  >
                    <Input
                      size='large'
                      placeholder='e.g., Technology, Business'
                      className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={8}>
                  <Form.Item
                    name='status'
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Status
                      </span>
                    }
                  >
                    <Select
                      size='large'
                      placeholder='Select status'
                      className='rounded-lg'
                    >
                      {statusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <Space>
                            <span>
                              {option.value === WebinarStatus.SCHEDULED && '📅'}
                              {option.value === WebinarStatus.LIVE && '🔴'}
                              {option.value === WebinarStatus.COMPLETED && '✅'}
                              {option.value === WebinarStatus.CANCELLED && '❌'}
                            </span>
                            <span>{option.label}</span>
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} lg={12}>
                  <Form.Item
                    name='meetingLink'
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Meeting Link
                      </span>
                    }
                    rules={[
                      { type: 'url', message: 'Please enter a valid URL' },
                    ]}
                  >
                    <Input
                      size='large'
                      prefix={<Link className='h-4 w-4 text-gray-400' />}
                      placeholder='https://zoom.us/j/123456789'
                      className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={12}>
                  <Form.Item
                    name='bannerUrl'
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Banner URL
                      </span>
                    }
                    rules={[
                      { type: 'url', message: 'Please enter a valid URL' },
                    ]}
                  >
                    <Input
                      size='large'
                      prefix={<UploadIcon className='h-4 w-4 text-gray-400' />}
                      placeholder='https://example.com/banner.jpg'
                      className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Submit Buttons */}
            <Divider className='my-8 border-background-200 dark:border-background-dark-300' />
            <div className='flex justify-end space-x-4 pt-6'>
              <Button
                size='large'
                onClick={onCancel}
                className='h-12 border-background-200 bg-white px-8 text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-paragraph-dark dark:hover:border-background-dark-200 dark:hover:text-heading-dark'
              >
                Cancel
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                loading={isLoading}
                className='h-12 border-primary bg-primary px-8 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
              >
                {mode === 'create' ? '🚀 Create Webinar' : '✅ Update Webinar'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};
