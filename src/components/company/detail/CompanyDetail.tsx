'use client';
import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Skeleton,
  Form,
  Drawer,
} from 'antd';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  User,
  MapPin,
  Building2,
  Globe,
} from 'lucide-react';
import {
  useCreateUser,
  useGetCompanyById,
  useGetUserByCompanyId,
} from '@/apis';
import { CompanySize } from '@/interfaces';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { handleErrorToast } from '@/utils';
import { CreateUserForm } from '@/components/user/form';
import { HtmlRenderer } from '@/components/common';

const { Title, Text, Paragraph } = Typography;

interface CompanyDetailProps {
  companyId: string;
}

export const CompanyDetail: React.FC<CompanyDetailProps> = ({ companyId }) => {
  const router = useRouter();
  const { data: company, isLoading } = useGetCompanyById(companyId);
  const { data: logins, refetch } = useGetUserByCompanyId(companyId);

  // const getSizeColor = (size: CompanySize) => {
  //   const colors = {
  //     [CompanySize.STARTUP]: '#F4612E',
  //     [CompanySize.SMALL]: '#395b50',
  //     [CompanySize.MEDIUM]: '#bfab25',
  //     [CompanySize.LARGE]: '#6a0136',
  //     [CompanySize.ENTERPRISE]: '#1f2f16',
  //   };
  //   return colors[size] || '#F4612E';
  // };

  const getSizeLabel = (size: CompanySize) => {
    const labels = {
      [CompanySize.STARTUP]: 'Startup',
      [CompanySize.SMALL]: 'Small Company',
      [CompanySize.MEDIUM]: 'Medium Company',
      [CompanySize.LARGE]: 'Large Company',
      [CompanySize.ENTERPRISE]: 'Enterprise',
    };
    return labels[size] || size;
  };

  const getSizeDescription = (size: CompanySize) => {
    const descriptions = {
      [CompanySize.STARTUP]: '1-10 employees',
      [CompanySize.SMALL]: '11-50 employees',
      [CompanySize.MEDIUM]: '51-200 employees',
      [CompanySize.LARGE]: '201-1000 employees',
      [CompanySize.ENTERPRISE]: '1000+ employees',
    };
    return descriptions[size] || '';
  };

  const createUser = useCreateUser();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateLogin = async (values: any) => {
    try {
      values.companyId = companyId;
      await createUser.mutateAsync(values);
      toast.success('Company login created successfully');
      await refetch();
      setIsModalOpen(false);
      // setIsEditing(false);
      form.resetFields();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background-100 p-6 dark:bg-background-dark-100'>
        <div className='mx-auto max-w-6xl'>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <Card className='bg-white p-8 text-center dark:bg-background-dark-200'>
          <Title level={3} className='mb-4 text-danger dark:text-danger-dark'>
            Company Not Found
          </Title>
          <Text className='mb-6 text-paragraph dark:text-paragraph-dark'>
            The company you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </Text>
          <Button
            type='primary'
            onClick={() => router.push('/admin/companies')}
            className='border-primary bg-primary text-white hover:border-primary-600 hover:bg-primary-600'
          >
            Back to Companies
          </Button>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/admin/companies/create/${companyId}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className='min-h-screen bg-background-100 py-8 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-6xl px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            icon={<ArrowLeft className='h-4 w-4' />}
            onClick={handleBack}
            className='mb-6 border-background-200 text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:text-paragraph-dark dark:hover:border-background-dark-200 dark:hover:text-heading-dark'
          >
            Back to Companies
          </Button>

          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='flex items-start space-x-6'>
              {/* Company Logo */}
              <div className='flex-shrink-0'>
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className='h-24 w-24 rounded-2xl border-2 border-background-200 object-cover shadow-sm dark:border-background-dark-300'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-3xl font-bold text-white shadow-sm'>
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className='flex-1'>
                <div className='mb-2 flex items-center gap-3'>
                  <Title
                    level={2}
                    className='mb-0 text-heading dark:text-heading-dark'
                  >
                    {company.name}
                  </Title>
                  {/* <Tag
                    color={getSizeColor(company.size)}
                    className='rounded-full border-0 px-3 py-1 font-medium'
                    style={{ color: 'white' }}
                  >
                    {getSizeLabel(company.size)}
                  </Tag> */}
                </div>

                <div className='mb-4 flex flex-wrap items-center gap-4 text-paragraph dark:text-paragraph-dark'>
                  <div className='flex items-center space-x-2'>
                    <Building2 className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text
                      strong
                      className='text-heading dark:text-heading-dark'
                    >
                      {company.industry}
                    </Text>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {company.location}
                    </Text>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <User className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {getSizeDescription(company.size)}
                    </Text>
                  </div>
                  {company.website && (
                    <div className=''>
                      <Link
                        href={company.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center space-x-2 font-medium text-primary transition-colors hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300'
                      >
                        <Globe className='h-4 w-4' />
                        <span>
                          {company.website.replace(/^https?:\/\//, '')}
                        </span>
                        <ExternalLink className='h-3 w-3' />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='flex-shrink-0'>
              <Button
                type='primary'
                size='large'
                onClick={handleEdit}
                className='h-12 border-primary bg-primary px-8 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
              >
                ✏️ Edit Company
              </Button>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Company Description */}
          <Col xs={24} lg={16}>
            <Card className='h-full bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-4 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-dark-200 dark:text-primary-dark-300'>
                  📝
                </span>
                About the Company
              </Title>
              <Paragraph className='text-base leading-relaxed text-paragraph dark:text-paragraph-dark'>
                <HtmlRenderer
                  htmlString={company.description || 'No description provided.'}
                />
              </Paragraph>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} lg={8}>
            <Card className='h-full bg-white shadow-sm dark:bg-background-dark-200'>
              {/* <Title level={4} className="text-heading dark:text-heading-dark mb-6 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-dark-100 text-indigo-600 dark:text-indigo-dark-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">📞</span>
                Contact Information
              </Title> */}

              {/* <div className='space-y-6'>
                {company.contactEmail && (
                  <div className='flex items-start space-x-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-dark-200'>
                      <Mail className='h-5 w-5 text-secondary-600 dark:text-secondary-dark-400' />
                    </div>
                    <div>
                      <Text
                        strong
                        className='block text-heading dark:text-heading-dark'
                      >
                        Email
                      </Text>
                      <a
                        href={`mailto:${company.contactEmail}`}
                        className='text-primary transition-colors hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300'
                      >
                        {company.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {company.contactNumber && (
                  <div className='flex items-start space-x-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-dark-100'>
                      <Phone className='h-5 w-5 text-indigo-600 dark:text-indigo-dark-600' />
                    </div>
                    <div>
                      <Text
                        strong
                        className='block text-heading dark:text-heading-dark'
                      >
                        Phone
                      </Text>
                      <a
                        href={`tel:${company.contactNumber}`}
                        className='text-primary transition-colors hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300'
                      >
                        {company.contactNumber}
                      </a>
                    </div>
                  </div>
                )}

                {company.createdAt && (
                  <div className='flex items-start space-x-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-dark-200'>
                      <Calendar className='h-5 w-5 text-secondary-600 dark:text-secondary-dark-400' />
                    </div>
                    <div>
                      <Text
                        strong
                        className='block text-heading dark:text-heading-dark'
                      >
                        Registered
                      </Text>
                      <Text className='text-paragraph dark:text-paragraph-dark'>
                        {new Date(company.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </Text>
                    </div>
                  </div>
                )}

                {!company.contactEmail && !company.contactNumber && (
                  <div className='py-8 text-center'>
                    <Text className='text-textColor dark:text-textColor-dark'>
                      No contact information available
                    </Text>
                  </div>
                )}
              </div> */}
              {/* <Card 
                className='border-0 shadow-sm'
                style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
              > */}
              <div className='mb-2 flex items-center justify-between'>
                <Title
                  level={5}
                  className='flex items-center'
                  style={{
                    color: '#F9FAFB',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  <div
                    className='mr-3 flex h-8 w-8 items-center justify-center rounded-lg'
                    style={{ backgroundColor: '#bfab2520' }}
                  >
                    <User className='h-4 w-4' style={{ color: '#bfab25' }} />
                  </div>
                  Login Credentials
                </Title>
                <Button
                  type='primary'
                  size='small'
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    backgroundColor: '#F4612E',
                    borderColor: '#F4612E',
                    borderRadius: '6px',
                    fontSize: '12px',
                    height: '32px',
                    padding: '0 12px',
                  }}
                >
                  {logins?.data?.length ? 'Update' : 'Create'}
                </Button>
              </div>

              <div className='space-y-3'>
                {logins?.data?.length ? (
                  logins.data.map((login: any, index: number) => (
                    <div
                      key={index}
                      className='rounded-lg border p-4'
                      style={{
                        backgroundColor: '#313131',
                        borderColor: '#4d4d4d',
                        borderWidth: '1px',
                      }}
                    >
                      <div className='mb-1 flex items-center justify-between'>
                        <Text
                          className='text-sm font-medium'
                          style={{ color: '#F9FAFB' }}
                        >
                          {login.name}
                        </Text>
                        <div
                          className='rounded-full px-2 text-xs font-medium'
                          // style={{
                          //   backgroundColor: login.isverified ? '#395b5020' : '#ef444420',
                          //   color: login.isverified ? '#395b50' : '#ef4444'
                          // }}
                        >
                          {login.isverified ? 'Verified' : 'Pending'}
                        </div>
                      </div>
                      <Text className='text-xs' style={{ color: '#AFADB5' }}>
                        {login.email}
                      </Text>
                    </div>
                  ))
                ) : (
                  <div
                    className='rounded-lg border-2 border-dashed p-6 text-center'
                    style={{ borderColor: '#4d4d4d' }}
                  >
                    <User
                      className='mx-auto mb-2 h-8 w-8'
                      style={{ color: '#AFADB5' }}
                    />
                    <Text className='text-sm' style={{ color: '#AFADB5' }}>
                      No login credentials created
                    </Text>
                    <Text className='mt-1 text-xs' style={{ color: '#6b7280' }}>
                      Click &quot;Create&quot; to add login access
                    </Text>
                  </div>
                )}
              </div>
              {/* </Card> */}
            </Card>
          </Col>
        </Row>

        {/* Company Stats */}
        <Row gutter={[24, 24]} className='mt-6'>
          <Col xs={24}>
            <Card className='bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-sm font-semibold text-secondary-600 dark:bg-secondary-dark-200 dark:text-secondary-dark-400'>
                  📊
                </span>
                Company Details
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Building2 className='mx-auto mb-2 h-8 w-8 text-primary dark:text-primary-dark' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Industry
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {company.industry}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <MapPin className='mx-auto mb-2 h-8 w-8 text-indigo-600 dark:text-indigo-dark-600' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Location
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {company.location}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <User className='mx-auto mb-2 h-8 w-8 text-secondary dark:text-secondary-dark' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Company Size
                    </Text>
                    <Text className='text-paragraph dark:text-paragraph-dark'>
                      {getSizeLabel(company.size)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Globe className='mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-dark-600' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Website
                    </Text>
                    {company.website ? (
                      <a
                        href={company.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-primary transition-colors hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300'
                      >
                        Visit Website
                      </a>
                    ) : (
                      <Text className='text-sm text-textColor dark:text-textColor-dark'>
                        Not provided
                      </Text>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <Drawer
        title={
          <h2 className='text-xl font-semibold text-white'>
            Create Login for this Company
          </h2>
        }
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        placement='right'
        width={600}
      >
        <CreateUserForm form={form} onFinish={handleCreateLogin} />
      </Drawer>
    </div>
  );
};
