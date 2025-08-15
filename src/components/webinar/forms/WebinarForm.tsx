'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Card,
  Row,
  Col,
  Divider,
  Typography,
  Space,
  Alert,
} from 'antd';
import {
  ArrowLeft,
  Upload as UploadIcon,
  Link,
  Clock,
  Calendar,
} from 'lucide-react';
import { Toast } from '@/libs/toast';
import {
  IWebinar,
  IWebinarCreateRequest,
  IWebinarUpdateRequest,
  WebinarStatus,
} from '@/interfaces';
import { useGetTimeslotOption } from '@/apis/timeslot';
import { useGetCompanyOption } from '@/apis/company';
import { TimeSlotPicker } from './TimeSlotPicker';
import { AppRichTextInput } from '@/components/common/forms';
import { useSearchParams } from 'next/navigation';

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

  const { data: timeslotOptions, isLoading: timeSlotLoading } =
    useGetTimeslotOption();
  const { data: companyOptions, isLoading: companyOptionsLoading } =
    useGetCompanyOption();
  const searchParams = useSearchParams();

  // Extract search params to prevent re-render loops
  const timeslotParam = searchParams.get('timeslot');
  const startTimeParam = searchParams.get('startTime');
  const hostId = searchParams.get('c');

  // Initialize form only once when component mounts or initialData changes
  useEffect(() => {
    console.log(isLoading);

    if (initialData && !isLoading) {
      // Edit mode: populate with existing data
      const formValues = {
        ...initialData,
        host: initialData.host?.id,
        timeslot: initialData.timeslot?.id,
      };

      form.setFieldsValue(formValues);
      setSelectedTimeslotId(initialData.timeslot?.id);

      const startTime = initialData.scheduledStartTime ?? undefined;

      setTimeSlotData({
        scheduledStartTime: startTime?.toString(),
        duration: initialData.duration,
      });
    } else {
      // Create mode: set defaults and handle search params (no status field)
      form.setFieldsValue({
        timeslot: timeslotParam || undefined,
      });

      if (hostId) {
        form.setFieldsValue({
          host: hostId || undefined,
        });
      }

      if (timeslotParam) {
        setSelectedTimeslotId(timeslotParam);

        if (startTimeParam) {
          setTimeSlotData({
            scheduledStartTime: startTimeParam,
            duration: 30,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]); // Intentionally only depend on isLoading to prevent loops

  const handleSubmit = async (values: any) => {
    if (!timeSlotData?.scheduledStartTime || !timeSlotData?.duration) {
      Toast.error('Please select time slots for the webinar');
      return;
    }
    await onSubmit({ ...values, ...timeSlotData });
  };

  const handleTimeslotChange = (value: string) => {
    setSelectedTimeslotId(value);
    // Clear time slot data when changing timeslot
    setTimeSlotData({});
  };

  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleTimeSlotChange = useCallback(
    (
      newValue: { scheduledStartTime: string; duration: number } | undefined
    ) => {
      if (newValue) {
        setTimeSlotData(newValue);
      } else {
        setTimeSlotData({});
      }
    },
    []
  );

  const statusOptions = [
    { label: 'Active', value: WebinarStatus.ACTIVE },
    { label: 'Cancelled', value: WebinarStatus.CANCELLED },
  ];

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
                  ? 'Schedule a new webinar session for participants. Status will be automatically set to Active.'
                  : 'Update webinar information and details. You can change the status to cancel if needed.'}
              </Text>
            </div>
          </div>
        </div>

        <Card className='border-0 bg-white shadow-lg dark:bg-background-dark-200'>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleSubmit}
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
                    <AppRichTextInput placeholder='Describe the webinar content, objectives, and what participants will learn' />
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
                    {!companyOptionsLoading && (
                      <Select
                        size='large'
                        placeholder='Select host company'
                        className='rounded-lg'
                        disabled={hostId ? true : false}
                      >
                        {companyOptions?.map((company: any) => (
                          <Option key={company.value} value={company.value}>
                            {company.label}
                          </Option>
                        ))}
                      </Select>
                    )}
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
                    {!timeSlotLoading && (
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
                    )}
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label={
                      <div className='flex items-center space-x-2'>
                        <Clock className='h-4 w-4 text-primary' />
                        <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                          Time Slots & Duration
                        </span>
                      </div>
                    }
                    required
                  >
                    <div className='mb-4'>
                      <Alert
                        message={
                          <div className='text-xs'>
                            <div className='mb-1 font-medium'>
                              How to schedule:
                            </div>
                            <ol className='ml-2 list-inside list-decimal space-y-1 text-xs'>
                              <li>
                                Select <strong>Host Company</strong> and{' '}
                                <strong>Timeslot</strong> above
                              </li>
                              <li>
                                Choose <strong>time slots</strong> and{' '}
                                <strong>duration</strong> below
                              </li>
                            </ol>
                          </div>
                        }
                        type='info'
                        className='mb-4'
                      />
                    </div>

                    <div
                      className={`rounded-lg border transition-all duration-200 ${
                        selectedTimeslotId
                          ? 'border-primary-200'
                          : 'border-background-200 bg-white dark:border-background-dark-300 dark:bg-background-dark-100'
                      } p-6`}
                    >
                      <div className='mb-4 flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <Calendar className='h-5 w-5 text-primary' />
                          <span className='font-medium text-heading dark:text-heading-dark'>
                            Select Time & Duration
                          </span>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            selectedTimeslotId
                              ? timeSlotData?.scheduledStartTime &&
                                timeSlotData?.duration
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {selectedTimeslotId
                            ? timeSlotData?.scheduledStartTime &&
                              timeSlotData?.duration
                              ? '✅ Ready'
                              : '⏳ Select Time'
                            : '⚠️ Select Timeslot First'}
                        </div>
                      </div>

                      {selectedTimeslotId ? (
                        <div className='py-8'>
                          <TimeSlotPicker
                            value={timeSlotData}
                            onChange={handleTimeSlotChange}
                            timeslotId={selectedTimeslotId}
                            disabled={!selectedTimeslotId}
                            excludeWebinarId={initialData?.id}
                          />

                          {timeSlotData?.scheduledStartTime &&
                            timeSlotData?.duration && (
                              <div className='mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20'>
                                <div className='flex items-center space-x-2 text-green-700 dark:text-green-300'>
                                  <Clock className='h-4 w-4' />
                                  <span className='text-sm font-medium'>
                                    Schedule:
                                  </span>
                                </div>
                                <div className='mt-1 text-sm text-green-600 dark:text-green-400'>
                                  <div>
                                    📅{' '}
                                    {new Date(
                                      timeSlotData?.scheduledStartTime
                                    ).toLocaleString()}
                                  </div>
                                  <div>⏱️ {timeSlotData?.duration} minutes</div>
                                </div>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className='py-8 text-center'>
                          <Calendar className='mx-auto mb-3 h-12 w-12 text-gray-400 opacity-50' />
                          <div className='text-sm font-medium text-gray-400'>
                            No Timeslot Selected
                          </div>
                          <div className='text-xs text-gray-400'>
                            Select host company and timeslot above
                          </div>
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
                <Col xs={24} lg={12}>
                  <Form.Item
                    name='maxParticipants'
                    label={
                      <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                        Max Participants{' '}
                        <span className='text-xs font-normal text-gray-400'>
                          Keep this empty for unlimited
                        </span>
                      </span>
                    }
                  >
                    <InputNumber
                      size='large'
                      min={1}
                      max={1000}
                      placeholder='Unlimited'
                      className='!w-full rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>

                {/* <Col xs={24} lg={8}>
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
                </Col> */}

                {/* Status field - only show in edit mode */}
                {mode === 'edit' && (
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name='status'
                      label={
                        <span className='font-medium text-paragraph dark:text-paragraph-dark'>
                          Status
                        </span>
                      }
                      extra={
                        <Text className='text-xs text-gray-500 dark:text-gray-400'>
                          Change to &apos;Cancelled&apos; to cancel this webinar
                        </Text>
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
                                {option.value === WebinarStatus.ACTIVE && '✅'}
                                {option.value === WebinarStatus.CANCELLED &&
                                  '❌'}
                              </span>
                              <span>{option.label}</span>
                            </Space>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}

                <Col xs={24} lg={mode === 'edit' ? 12 : 24}>
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

                <Col xs={24} lg={mode === 'edit' ? 12 : 24}>
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
