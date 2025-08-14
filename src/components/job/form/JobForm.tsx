'use client';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  DatePicker,
  InputNumber,
  Divider,
  Tag,
} from 'antd';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IJob, JobType, ExperienceLevel, JobStatus } from '@/interfaces';
import { AppRichTextInput } from '@/components/common/forms';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

interface JobFormProps {
  initialData?: IJob;
  isEdit?: boolean;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  companyOptions: { label: string; value: string }[];
  companiesLoading: boolean;
  companyId?: string;
}

export const JobForm: React.FC<JobFormProps> = ({
  initialData,
  isEdit = false,
  onSubmit,
  isLoading,
  companyOptions,
  companiesLoading,
  companyId,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [skillInput, setSkillInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || []
  );
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits || []
  );

  // Set initial form values when editing
  useEffect(() => {
    if (initialData && isEdit) {
      form.setFieldsValue({
        ...initialData,
        companyId,
        applicationDeadline: initialData.applicationDeadline
          ? dayjs(initialData.applicationDeadline)
          : null,
      });
      setSkills(initialData.skills || []);
      setRequirements(initialData.requirements || []);
      setBenefits(initialData.benefits || []);
    }
  }, [initialData, isEdit, form, companyId]);

  const handleSubmit = async (values: any) => {
    const jobData = {
      ...values,
      skills,
      requirements,
      benefits,
    };
    await onSubmit(jobData);
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addRequirement = () => {
    if (
      requirementInput.trim() &&
      !requirements.includes(requirementInput.trim())
    ) {
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (requirementToRemove: string) => {
    setRequirements(requirements.filter((req) => req !== requirementToRemove));
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setBenefits(benefits.filter((benefit) => benefit !== benefitToRemove));
  };

  const getJobTypeLabel = (type: JobType) => {
    const labels = {
      [JobType.FULL_TIME]: 'Full Time',
      [JobType.PART_TIME]: 'Part Time',
      [JobType.CONTRACT]: 'Contract',
      [JobType.INTERNSHIP]: 'Internship',
      [JobType.REMOTE]: 'Remote',
    };
    return labels[type] || type;
  };

  const getExperienceLevelLabel = (level: ExperienceLevel) => {
    const labels = {
      [ExperienceLevel.ENTRY]: 'Entry Level',
      [ExperienceLevel.MID]: 'Mid Level',
      [ExperienceLevel.SENIOR]: 'Senior Level',
      [ExperienceLevel.LEAD]: 'Lead/Manager',
      [ExperienceLevel.EXECUTIVE]: 'Executive',
    };
    return labels[level] || level;
  };

  return (
    <div className='min-h-screen bg-background-100 py-8 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-4xl px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            icon={<ArrowLeft className='h-4 w-4' />}
            onClick={() => router.back()}
            className='mb-4 border-background-200 text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:text-paragraph-dark dark:hover:border-background-dark-200 dark:hover:text-heading-dark'
          >
            Back to Jobs
          </Button>

          <div className='mb-6'>
            <Title
              level={2}
              className='mb-2 text-heading dark:text-heading-dark'
            >
              {isEdit ? 'Edit Job' : 'Create New Job'}
            </Title>
            <Text className='text-lg text-paragraph dark:text-paragraph-dark'>
              {isEdit
                ? 'Update job posting information and requirements'
                : 'Create a new job posting for the digital job fair'}
            </Text>
          </div>
        </div>

        <Card className='border-0 bg-white shadow-lg dark:bg-background-dark-200'>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleSubmit}
            initialValues={{
              ...initialData,
              applicationDeadline: initialData?.applicationDeadline
                ? dayjs(initialData.applicationDeadline)
                : undefined,
            }}
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
                Job Information
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} lg={16}>
                  <Form.Item
                    name='title'
                    label={
                      <span className='font-medium text-heading dark:text-heading-dark'>
                        Job Title
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please enter job title' },
                    ]}
                  >
                    <Input
                      size='large'
                      placeholder='e.g. Senior Software Developer'
                      className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    name='companyId'
                    label={
                      <span className='font-medium text-heading dark:text-heading-dark'>
                        Company
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please select company' },
                    ]}
                  >
                    <Select
                      size='large'
                      placeholder='Select company'
                      loading={companiesLoading}
                      className='rounded-lg'
                      popupClassName='dark:bg-background-dark-200'
                      disabled={companyId ? true : false}
                      defaultValue={companyId}
                    >
                      {companyOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name='description'
                    label={
                      <span className='font-medium text-heading dark:text-heading-dark'>
                        Job Description
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please enter job description',
                      },
                    ]}
                  >
                    <AppRichTextInput placeholder='Describe the role, responsibilities, and what makes this position unique...' />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider className='my-8 border-background-200 dark:border-background-dark-300' />

            {/* Job Details Section */}
            <div>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-dark-200 dark:text-primary-dark-300'>
                  2
                </span>
                Position Details
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    name='location'
                    label={
                      <span className='font-medium text-heading dark:text-heading-dark'>
                        Location
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please enter location' },
                    ]}
                  >
                    <Input
                      size='large'
                      placeholder='e.g. Dhaka, Bangladesh'
                      className='rounded-lg border-background-200 bg-white text-textColor focus:border-primary focus:ring-primary dark:border-background-dark-300 dark:bg-background-dark-100 dark:text-textColor-dark'
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    name='type'
                    label={
                      <span className='font-medium text-heading dark:text-heading-dark'>
                        Job Type
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please select job type' },
                    ]}
                  >
                    <Select
                      size='large'
                      placeholder='Select job type'
                      className='rounded-lg'
                      dropdownClassName='dark:bg-background-dark-200'
                    >
                      {Object.values(JobType).map((type) => (
                        <Option key={type} value={type}>
                          {getJobTypeLabel(type)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    name='experienceLevel'
                    label={
                      <span className='font-medium text-heading dark:text-heading-dark'>
                        Experience Level
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please select experience level',
                      },
                    ]}
                  >
                    <Select
                      size='large'
                      placeholder='Select experience level'
                      className='rounded-lg'
                      dropdownClassName='dark:bg-background-dark-200'
                    >
                      {Object.values(ExperienceLevel).map((level) => (
                        <Option key={level} value={level}>
                          {getExperienceLevelLabel(level)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider className='my-8 border-background-200 dark:border-background-dark-300' />

            {/* Salary & Timeline Section */}
            <div>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-dark-200 dark:text-primary-dark-300'>
                  3
                </span>
                Compensation & Timeline
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name='salaryMin'
                    label={
                      <span className='text-sm font-medium text-paragraph dark:text-paragraph-dark'>
                        Minimum Salary
                      </span>
                    }
                  >
                    <InputNumber
                      size='large'
                      placeholder='50000'
                      className='!w-full border-background-200 bg-white text-textColor focus:border-primary'
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name='salaryMax'
                    label={
                      <span className='text-sm font-medium text-paragraph dark:text-paragraph-dark'>
                        Maximum Salary
                      </span>
                    }
                  >
                    <InputNumber
                      size='large'
                      placeholder='100000'
                      className='!w-full border-background-200 bg-white text-textColor focus:border-primary'
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name='currency'
                    label={
                      <span className='text-sm font-medium text-paragraph dark:text-paragraph-dark'>
                        Currency
                      </span>
                    }
                  >
                    <Select
                      size='large'
                      placeholder='Select currency'
                      defaultValue='BDT'
                      className='border-background-200'
                    >
                      <Option value='BDT'>BDT - Bangladeshi Taka</Option>
                      <Option value='USD'>USD - US Dollar</Option>
                      <Option value='EUR'>EUR - Euro</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name='applicationDeadline'
                    label={
                      <span className='text-sm font-medium text-paragraph dark:text-paragraph-dark'>
                        Application Deadline
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please select application deadline',
                      },
                    ]}
                  >
                    <DatePicker
                      size='large'
                      className='w-full border-background-200 bg-white text-textColor focus:border-primary'
                      placeholder='Select deadline'
                      showTime
                      format='YYYY-MM-DD HH:mm'
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name='status'
                    label={
                      <span className='text-sm font-medium text-paragraph dark:text-paragraph-dark'>
                        Job Status
                      </span>
                    }
                  >
                    <Select
                      size='large'
                      placeholder='Select status'
                      defaultValue={JobStatus.OPEN}
                      className='border-background-200'
                    >
                      <Option value={JobStatus.DRAFT}>Draft</Option>
                      <Option value={JobStatus.OPEN}>Open</Option>
                      <Option value={JobStatus.CLOSED}>Closed</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider className='border-background-200 dark:border-background-dark-300' />

            {/* Skills Section */}
            <div>
              <Title
                level={5}
                className='mb-4 text-heading dark:text-heading-dark'
              >
                <span className='mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white'>
                  4
                </span>
                Required Skills
              </Title>

              <div className='mb-4'>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    size='large'
                    placeholder='Add a skill (e.g. JavaScript, React, Node.js)'
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onPressEnter={addSkill}
                    className='border-background-200 bg-white text-textColor focus:border-primary'
                  />
                  <Button
                    size='large'
                    icon={<Plus className='h-4 w-4' />}
                    onClick={addSkill}
                    className='border-primary bg-primary text-white hover:bg-primary-dark'
                  >
                    Add
                  </Button>
                </Space.Compact>
              </div>

              <div className='flex flex-wrap gap-2'>
                {skills.map((skill, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => removeSkill(skill)}
                    className='rounded-md border-primary bg-primary/10 px-2 py-1 text-primary'
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>

            <Divider className='border-background-200 dark:border-background-dark-300' />

            {/* Requirements Section */}
            <div>
              <Title
                level={5}
                className='mb-4 text-heading dark:text-heading-dark'
              >
                <span className='mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white'>
                  5
                </span>
                Job Requirements
              </Title>

              <div className='mb-4'>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    size='large'
                    placeholder='Add a requirement (e.g. Bachelor degree in Computer Science)'
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onPressEnter={addRequirement}
                    className='border-background-200 bg-white text-textColor focus:border-primary'
                  />
                  <Button
                    size='large'
                    icon={<Plus className='h-4 w-4' />}
                    onClick={addRequirement}
                    className='border-primary bg-primary text-white hover:bg-primary-dark'
                  >
                    Add
                  </Button>
                </Space.Compact>
              </div>

              <div className='space-y-2'>
                {requirements.map((requirement, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg bg-background-200 p-3 dark:bg-background-dark-200'
                  >
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {requirement}
                    </Text>
                    <Button
                      size='small'
                      icon={<X className='h-3 w-3' />}
                      onClick={() => removeRequirement(requirement)}
                      className='border-red-500 bg-red-500 text-white hover:bg-red-600'
                    />
                  </div>
                ))}
              </div>
            </div>

            <Divider className='border-background-200 dark:border-background-dark-300' />

            {/* Benefits Section */}
            <div>
              <Title
                level={5}
                className='mb-4 text-heading dark:text-heading-dark'
              >
                <span className='mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white'>
                  6
                </span>
                Benefits & Perks (Optional)
              </Title>

              <div className='mb-4'>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    size='large'
                    placeholder='Add a benefit (e.g. Health insurance, Flexible working hours)'
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onPressEnter={addBenefit}
                    className='border-background-200 bg-white text-textColor focus:border-primary'
                  />
                  <Button
                    size='large'
                    icon={<Plus className='h-4 w-4' />}
                    onClick={addBenefit}
                    className='border-primary bg-primary text-white hover:bg-primary-dark'
                  >
                    Add
                  </Button>
                </Space.Compact>
              </div>

              <div className='flex flex-wrap gap-2'>
                {benefits.map((benefit, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => removeBenefit(benefit)}
                    className='rounded-md border-primary bg-primary/10 px-2 py-1 text-primary'
                  >
                    {benefit}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <Divider className='border-background-200 dark:border-background-dark-300' />
            <div className='flex justify-end space-x-4 pt-6'>
              <Button
                size='large'
                onClick={() => router.back()}
                className='h-12 border-background-300 bg-background-200 px-8 font-medium text-paragraph hover:bg-background-300 dark:border-background-dark-300 dark:bg-background-dark-200 dark:text-paragraph-dark dark:hover:bg-background-dark-300'
              >
                Cancel
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                loading={isLoading}
                className='h-12 border-primary bg-primary px-8 font-medium text-white hover:bg-primary-dark'
              >
                {isEdit ? '✅ Update Job' : '🚀 Create Job'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};
