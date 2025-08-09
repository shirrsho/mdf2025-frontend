'use client';
import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Card,
  Row,
  Col,
  notification,
  Divider,
  Typography,
  Space
} from 'antd';
import { Upload as UploadIcon, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateCompany, useUpdateCompany } from '@/apis';
import { ICompany, CompanySize } from '@/interfaces';
import { handleErrorToast } from '@/utils';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

interface CreateCompanyFormProps {
  initialData?: ICompany;
  isEdit?: boolean;
}

export const CreateCompanyForm: React.FC<CreateCompanyFormProps> = ({
  initialData,
  isEdit = false
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // Append logo file if selected
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (isEdit && initialData?.id) {
        await updateCompany.mutateAsync({
          id: initialData.id,
          data: formData
        });
        notification.success({
          message: 'Success',
          description: 'Company updated successfully!',
          placement: 'topRight',
        });
      } else {
        await createCompany.mutateAsync(formData);
        notification.success({
          message: 'Success',
          description: 'Company created successfully!',
          placement: 'topRight',
        });
      }

      router.push('/admin/companies');
    } catch (error) {
      handleErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setLogoFile(file);
    }
  };

  const validateURL = (rule: any, value: string) => {
    if (value && !value.match(/^https?:\/\/.+/)) {
      return Promise.reject('Please enter a valid URL starting with http:// or https://');
    }
    return Promise.resolve();
  };

  const validateEmail = (rule: any, value: string) => {
    if (value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return Promise.reject('Please enter a valid email address');
    }
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-background-100 dark:bg-background-dark-100 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => router.back()}
            className="mb-4 text-paragraph dark:text-paragraph-dark hover:text-heading dark:hover:text-heading-dark border-background-200 dark:border-background-dark-300 hover:border-background-300 dark:hover:border-background-dark-200"
          >
            Back to Companies
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="mb-2 text-heading dark:text-heading-dark">
                {isEdit ? 'Edit Company' : 'Add New Company'}
              </Title>
              <Text className="text-paragraph dark:text-paragraph-dark text-lg">
                {isEdit 
                  ? 'Update company information and details' 
                  : 'Register a new company for the job fair'
                }
              </Text>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-background-dark-200">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialData}
            className="space-y-6"
          >
            {/* Basic Information Section */}
            <div>
              <Title level={4} className="text-heading dark:text-heading-dark mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-dark-200 text-primary-600 dark:text-primary-dark-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
                Basic Information
              </Title>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="name"
                    label={<span className="text-heading dark:text-heading-dark font-medium">Company Name</span>}
                    rules={[
                      { required: true, message: 'Please enter company name' },
                      { min: 2, message: 'Company name must be at least 2 characters' }
                    ]}
                  >
                    <Input 
                      size="large" 
                      placeholder="e.g. Tech Solutions Inc."
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="industry"
                    label={<span className="text-heading dark:text-heading-dark font-medium">Industry</span>}
                    rules={[{ required: true, message: 'Please enter industry' }]}
                  >
                    <Input 
                      size="large" 
                      placeholder="e.g. Information Technology"
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="description"
                    label={<span className="text-heading dark:text-heading-dark font-medium">Company Description</span>}
                    rules={[
                      { required: true, message: 'Please enter company description' },
                      { min: 50, message: 'Description should be at least 50 characters' }
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Describe your company, mission, and what makes it unique..."
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider className="my-8 border-background-200 dark:border-background-dark-300" />

            {/* Company Details Section */}
            <div>
              <Title level={4} className="text-heading dark:text-heading-dark mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
                Company Details
              </Title>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="location"
                    label={<span className="text-paragraph dark:text-paragraph-dark font-medium">Location</span>}
                    rules={[{ required: true, message: 'Please enter company location' }]}
                  >
                    <Input 
                      size="large" 
                      placeholder="e.g. San Francisco, CA"
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="size"
                    label={<span className="text-paragraph dark:text-paragraph-dark font-medium">Company Size</span>}
                    rules={[{ required: true, message: 'Please select company size' }]}
                  >
                    <Select 
                      size="large" 
                      placeholder="Select company size"
                      className="rounded-lg"
                    >
                      <Option value={CompanySize.STARTUP}>
                        <Space>
                          <span>🚀</span>
                          <span>Startup (1-10 employees)</span>
                        </Space>
                      </Option>
                      <Option value={CompanySize.SMALL}>
                        <Space>
                          <span>🏢</span>
                          <span>Small (11-50 employees)</span>
                        </Space>
                      </Option>
                      <Option value={CompanySize.MEDIUM}>
                        <Space>
                          <span>🏗️</span>
                          <span>Medium (51-200 employees)</span>
                        </Space>
                      </Option>
                      <Option value={CompanySize.LARGE}>
                        <Space>
                          <span>🌆</span>
                          <span>Large (201-1000 employees)</span>
                        </Space>
                      </Option>
                      <Option value={CompanySize.ENTERPRISE}>
                        <Space>
                          <span>🌍</span>
                          <span>Enterprise (1000+ employees)</span>
                        </Space>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="website"
                    label={<span className="text-paragraph dark:text-paragraph-dark font-medium">Website URL</span>}
                    rules={[
                      { required: true, message: 'Please enter website URL' },
                      { validator: validateURL }
                    ]}
                  >
                    <Input 
                      size="large" 
                      placeholder="https://www.company.com"
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="logo"
                    label={<span className="text-paragraph dark:text-paragraph-dark font-medium">Company Logo</span>}
                  >
                    <Upload
                      accept="image/*"
                      showUploadList={false}
                      onChange={handleLogoChange}
                      beforeUpload={() => false}
                      className="w-full"
                    >
                      <Button 
                        icon={<UploadIcon className="w-4 h-4" />} 
                        size="large"
                        className="w-full h-12 border-dashed border-background-200 dark:border-background-dark-300 hover:border-primary text-paragraph dark:text-paragraph-dark hover:text-primary bg-white dark:bg-background-dark-100"
                      >
                        {logoFile ? logoFile.name : 'Upload Logo (Optional)'}
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider className="my-8" />

            {/* Contact Information Section */}
            <div>
              <Title level={4} className="text-heading dark:text-heading-dark mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
                Contact Information
              </Title>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="contactEmail"
                    label={<span className="text-paragraph dark:text-paragraph-dark font-medium">Contact Email</span>}
                    rules={[
                      { required: true, message: 'Please enter contact email' },
                      { validator: validateEmail }
                    ]}
                  >
                    <Input 
                      size="large" 
                      placeholder="contact@company.com"
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="contactNumber"
                    label={<span className="text-paragraph dark:text-paragraph-dark font-medium">Contact Number</span>}
                  >
                    <Input 
                      size="large" 
                      placeholder="+1 (555) 123-4567"
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="contactPersonName"
                    label={<span className="text-paragraph dark:text-paragraph-dark font-medium">Contact Person Name</span>}
                  >
                    <Input 
                      size="large" 
                      placeholder="John Smith"
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="contactPersonDesignation"
                    label={<span className="text-paragraph dark:text-paragraph-dark font-medium">Contact Person Designation</span>}
                  >
                    <Input 
                      size="large" 
                      placeholder="HR Manager"
                      className="rounded-lg border-background-200 dark:border-background-dark-300 focus:border-primary focus:ring-primary bg-white dark:bg-background-dark-100 text-textColor dark:text-textColor-dark"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Submit Buttons */}
            <Divider className="my-8 border-background-200 dark:border-background-dark-300" />
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                size="large"
                onClick={() => router.back()}
                className="px-8 h-12 border-background-200 dark:border-background-dark-300 text-paragraph dark:text-paragraph-dark hover:text-heading dark:hover:text-heading-dark hover:border-background-300 dark:hover:border-background-dark-200 bg-white dark:bg-background-dark-100"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                className="px-8 h-12 bg-primary hover:bg-primary-600 border-primary hover:border-primary-600 font-medium text-white"
              >
                {isEdit ? '✅ Update Company' : '🚀 Create Company'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};
