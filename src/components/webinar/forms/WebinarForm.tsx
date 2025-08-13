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
} from 'antd';
import {
  Save,
  X,
  Upload as UploadIcon,
  Calendar,
  Clock,
  Users,
  Link,
  Tag,
} from 'lucide-react';
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
      setSelectedTimeslotId(initialData.timeslotId?.toString());
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
    <div className='min-h-screen bg-background-100 p-6 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-4xl'>
        <Card
          title={
            <div className='flex items-center gap-3'>
              <Calendar className='h-6 w-6 text-primary' />
              <span className='text-xl font-semibold text-heading dark:text-white'>
                {mode === 'create' ? 'Create New Webinar' : 'Edit Webinar'}
              </span>
            </div>
          }
          className='border-0 shadow-lg'
          style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
        >
          <Form
            form={form}
            layout='vertical'
            onFinish={handleSubmit}
            initialValues={initialValues}
            className='space-y-6'
          >
            <Row gutter={24}>
              {/* Basic Information */}
              <Col xs={24}>
                <div className='mb-6'>
                  <h3 className='mb-4 flex items-center gap-2 text-lg font-medium text-gray-200'>
                    <Tag className='h-5 w-5' />
                    Basic Information
                  </h3>

                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Webinar Title
                          </span>
                        }
                        name='title'
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
                          placeholder='Enter webinar title'
                          className='h-12 border-gray-600 bg-gray-800 text-white placeholder:text-gray-400'
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Description
                          </span>
                        }
                        name='description'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter webinar description',
                          },
                          {
                            min: 20,
                            message:
                              'Description must be at least 20 characters',
                          },
                          {
                            max: 1000,
                            message:
                              'Description must not exceed 1000 characters',
                          },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          placeholder='Describe the webinar content, objectives, and what participants will learn'
                          className='border-gray-600 bg-gray-800 text-white placeholder:text-gray-400'
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Scheduling */}
              <Col xs={24}>
                <div className='mb-6'>
                  <h3 className='mb-4 flex items-center gap-2 text-lg font-medium text-gray-200'>
                    <Clock className='h-5 w-5' />
                    Scheduling
                  </h3>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Host Company
                          </span>
                        }
                        name='hostId'
                        rules={[
                          {
                            required: true,
                            message: 'Please select host company',
                          },
                        ]}
                      >
                        <Select
                          placeholder='Select host company'
                          className='h-12'
                          style={{ height: '48px' }}
                        >
                          {companyOptions?.map((company: any) => (
                            <Option key={company.value} value={company.value}>
                              {company.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Timeslot
                          </span>
                        }
                        name='timeslotId'
                        rules={[
                          { required: true, message: 'Please select timeslot' },
                        ]}
                      >
                        <Select
                          placeholder='Select timeslot'
                          className='h-12'
                          style={{ height: '48px' }}
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
                          <span className='text-sm font-medium text-gray-300'>
                            Time Slots & Duration
                          </span>
                        }
                        required
                      >
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
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Additional Settings */}
              <Col xs={24}>
                <div className='mb-6'>
                  <h3 className='mb-4 flex items-center gap-2 text-lg font-medium text-gray-200'>
                    <Users className='h-5 w-5' />
                    Additional Settings
                  </h3>

                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Max Participants
                          </span>
                        }
                        name='maxParticipants'
                      >
                        <InputNumber
                          min={1}
                          max={1000}
                          placeholder='100'
                          className='h-12 w-full border-gray-600 bg-gray-800 text-white'
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Category
                          </span>
                        }
                        name='category'
                      >
                        <Input
                          placeholder='e.g., Technology, Business'
                          className='h-12 border-gray-600 bg-gray-800 text-white placeholder:text-gray-400'
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Status
                          </span>
                        }
                        name='status'
                      >
                        <Select
                          placeholder='Select status'
                          className='h-12'
                          style={{ height: '48px' }}
                        >
                          {statusOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Meeting Link
                          </span>
                        }
                        name='meetingLink'
                        rules={[
                          { type: 'url', message: 'Please enter a valid URL' },
                        ]}
                      >
                        <Input
                          prefix={<Link className='h-4 w-4 text-gray-400' />}
                          placeholder='https://zoom.us/j/123456789'
                          className='h-12 border-gray-600 bg-gray-800 text-white placeholder:text-gray-400'
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium text-gray-300'>
                            Banner URL
                          </span>
                        }
                        name='bannerUrl'
                        rules={[
                          { type: 'url', message: 'Please enter a valid URL' },
                        ]}
                      >
                        <Input
                          prefix={
                            <UploadIcon className='h-4 w-4 text-gray-400' />
                          }
                          placeholder='https://example.com/banner.jpg'
                          className='h-12 border-gray-600 bg-gray-800 text-white placeholder:text-gray-400'
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Form Actions */}
            <div className='flex justify-end gap-4 border-t border-gray-600 pt-6'>
              <Button
                onClick={onCancel}
                className='h-12 border-gray-600 px-6 text-gray-300 hover:border-gray-500 hover:text-white'
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
                {mode === 'create' ? 'Create Webinar' : 'Update Webinar'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};
