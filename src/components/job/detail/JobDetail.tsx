'use client';
import React from 'react';
import { Button, Typography, Card, Row, Col, Tag, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Briefcase,
  CheckCircle,
  XCircle,
  Building2,
  Pause,
  ArrowRight,
} from 'lucide-react';
import { JobType } from '@/interfaces';
import { useGetJobById } from '@/apis';
import { HtmlRenderer } from '@/components/common';
import { formatSalary } from '@/utils';
const { Title, Text } = Typography;

interface JobDetailProps {
  jobId: string;
  mode: 'admin' | 'company' | 'public';
}

export const JobDetail: React.FC<JobDetailProps> = ({ jobId, mode }) => {
  const router = useRouter();
  const { data: job, isLoading } = useGetJobById(jobId);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background-100 py-8 dark:bg-background-dark-100'>
        <div className='mx-auto max-w-6xl px-4 py-8'>
          <Skeleton active />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-gray-800'>
          <h3 className='mb-4 text-xl font-bold text-red-600 dark:text-red-400'>
            Job Not Found
          </h3>
          <p className='mb-6 text-gray-600 dark:text-gray-300'>
            The job you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            type='primary'
            onClick={() => router.push('/admin/jobs')}
            className='border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700'
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return { bg: '#395b5020', color: '#395b50' };
      case 'closed':
        return { bg: '#ef444420', color: '#ef4444' };
      default:
        return { bg: '#8c8c8c20', color: '#8c8c8c' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <CheckCircle className='h-5 w-5' />;
      case 'closed':
        return <XCircle className='h-5 w-5' />;
      default:
        return <Pause className='h-5 w-5' />;
    }
  };

  const getJobTypeColor = (type: JobType) => {
    const colors = {
      [JobType.FULL_TIME]: '#F4612E',
      [JobType.PART_TIME]: '#bfab25',
      [JobType.CONTRACT]: '#6a0136',
      [JobType.INTERNSHIP]: '#395b50',
      [JobType.REMOTE]: '#1f2f16',
    };
    return colors[type] || '#F4612E';
  };

  return (
    <div className='min-h-screen bg-background-100 py-8 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-6xl px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            icon={<ArrowLeft className='h-4 w-4' />}
            onClick={() => router.back()}
            className='mb-6 border-background-200 text-paragraph hover:border-background-300 hover:text-heading dark:border-background-dark-300 dark:text-paragraph-dark dark:hover:border-background-dark-200 dark:hover:text-heading-dark'
          >
            Back to Jobs
          </Button>

          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='flex items-start space-x-6'>
              {/* Company Logo or Title */}
              <div className='flex-shrink-0'>
                {job.company?.logoUrl ? (
                  <img
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    className='h-24 w-24 rounded-2xl border-2 border-background-200 object-cover shadow-sm dark:border-background-dark-300'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-3xl font-bold text-white shadow-sm'>
                    {job.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Job Info */}
              <div className='mb-2 flex-1'>
                <div className='flex items-baseline gap-3'>
                  <Title
                    level={2}
                    className='text-heading dark:text-heading-dark'
                  >
                    {job.title}
                  </Title>
                  <div
                    className='flex items-center gap-2 rounded-full border-0 px-3 py-1 font-medium text-white'
                    style={{
                      backgroundColor: getStatusColor(job.status).color,
                    }}
                  >
                    {getStatusIcon(job.status)}
                    <span className='text-sm'>{job.status.toUpperCase()}</span>
                  </div>
                </div>

                <div className='mb-4 flex flex-wrap items-center gap-4 text-paragraph dark:text-paragraph-dark'>
                  <div className='flex items-center space-x-2'>
                    <Building2 className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <span className='text-xl font-bold text-primary dark:text-primary-dark'>
                      {job.company?.name || 'Unknown Company'}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <span className='text-lg font-semibold text-secondary dark:text-secondary-dark'>
                      {job.location}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <span className='text-paragraph dark:text-paragraph-dark'>
                      Posted{' '}
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-4 w-4 text-textColor dark:text-textColor-dark' />
                    <span className='text-paragraph dark:text-paragraph-dark'>
                      Deadline{' '}
                      {job.applicationDeadline
                        ? new Date(job.applicationDeadline).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Tag
                    style={{
                      backgroundColor: `${getJobTypeColor(job.type)}20`,
                      color: getJobTypeColor(job.type),
                      border: 'none',
                      fontSize: '12px',
                    }}
                  >
                    {job.type.replace('_', ' ').toUpperCase()}
                  </Tag>
                  <Tag
                    style={{
                      backgroundColor: '#F4612E20',
                      color: '#F4612E',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  >
                    {job.experienceLevel}
                  </Tag>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {mode !== 'public' && (
              <div className='flex-shrink-0'>
                <Button
                  type='primary'
                  size='large'
                  icon={<Edit className='h-4 w-4' />}
                  onClick={() => router.push(`/admin/jobs/create/${job.id}`)}
                  className='h-12 border-primary bg-primary px-8 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
                >
                  ✏️ Edit Job
                </Button>
              </div>
            )}
            {mode === 'public' && (
              <div className='flex-shrink-0'>
                <Button
                  type='primary'
                  size='large'
                  icon={<ArrowRight className='h-4 w-4' />}
                  onClick={() => router.push(`/p/jobs/apply/${job.id}`)}
                  className='h-12 border-primary bg-primary px-8 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
                >
                  Apply Now
                </Button>
              </div>
            )}
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Job Description */}
          <Col xs={24} lg={16}>
            <Card className='h-full bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-4 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-dark-200 dark:text-primary-dark-300'>
                  📝
                </span>
                About the Job
              </Title>
              <div className='mb-6 text-base leading-relaxed text-paragraph dark:text-paragraph-dark'>
                <HtmlRenderer htmlString={job.description} />
              </div>

              {/* Highlighted Company and Salary Info */}
              <div className='from-primary-50 to-secondary-50 mb-6 rounded-lg bg-gradient-to-r p-4 dark:from-primary-dark-200/20 dark:to-secondary-dark-200/20'>
                <div className='grid gap-4 sm:grid-cols-1'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-dark-200'>
                      <Building2 className='h-5 w-5 text-primary-600 dark:text-primary-dark-400' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-textColor dark:text-textColor-dark'>
                        Company
                      </p>
                      <p className='text-lg font-bold text-primary dark:text-primary-dark'>
                        {job.company?.name || 'Unknown Company'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-dark-200'>
                      <DollarSign className='h-5 w-5 text-secondary-600 dark:text-secondary-dark-400' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-textColor dark:text-textColor-dark'>
                        Compensation
                      </p>
                      <p className='text-lg font-bold text-secondary dark:text-secondary-dark'>
                        {formatSalary(job)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className='mb-4'>
                  <p className='mb-2 text-sm font-medium text-textColor dark:text-textColor-dark'>
                    Required Skills
                  </p>
                  <div className='inline-block'>
                    {job.skills.map((skill, index) => (
                      <Tag
                        key={index}
                        style={{
                          backgroundColor: '#313131',
                          color: '#D1D5DB',
                          border: '1px solid #4d4d4d',
                          fontSize: '12px',
                          padding: '4px 8px',
                          margin: '2px',
                        }}
                      >
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* Sidebar Info */}
          <Col xs={24} lg={8}>
            <Card className='h-full bg-white shadow-sm dark:bg-background-dark-200'>
              <div className='mb-2 flex items-center justify-between'>
                <Title
                  level={5}
                  className='flex items-center text-heading dark:text-heading-dark'
                >
                  <div className='dark:bg-indigo-dark-200 mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100'>
                    <Users className='dark:text-indigo-dark-400 h-4 w-4 text-indigo-600' />
                  </div>
                  Quick Stats
                </Title>
              </div>

              <div className='space-y-4'>
                <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                  <div className='text-2xl font-bold text-heading dark:text-heading-dark'>
                    0
                  </div>
                  <Text className='text-sm text-paragraph dark:text-paragraph-dark'>
                    Applications
                  </Text>
                </div>

                <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                  <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    {job.status === 'open' ? 'Open' : 'Closed'}
                  </div>
                  <Text className='text-sm text-paragraph dark:text-paragraph-dark'>
                    Status
                  </Text>
                </div>

                <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                  <Clock className='mx-auto mb-2 h-8 w-8 text-yellow-600 dark:text-yellow-400' />
                  <Text
                    strong
                    className='block text-heading dark:text-heading-dark'
                  >
                    Deadline
                  </Text>
                  <Text className='text-lg font-semibold text-yellow-600 dark:text-yellow-400'>
                    {job.applicationDeadline
                      ? new Date(job.applicationDeadline).toLocaleDateString()
                      : 'N/A'}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Job Details */}
        <Row gutter={[24, 24]} className='mt-6'>
          <Col xs={24}>
            <Card className='bg-white shadow-sm dark:bg-background-dark-200'>
              <Title
                level={4}
                className='mb-6 flex items-center text-heading dark:text-heading-dark'
              >
                <span className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-sm font-semibold text-secondary-600 dark:bg-secondary-dark-200 dark:text-secondary-dark-400'>
                  📋
                </span>
                Job Details
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Briefcase className='mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Type
                    </Text>
                    <Text
                      className='font-semibold'
                      style={{ color: getJobTypeColor(job.type) }}
                    >
                      {job.type.replace('_', ' ').toUpperCase()}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <CheckCircle className='mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Experience
                    </Text>
                    <Text
                      className='font-semibold'
                      style={{ color: '#722ed1' }}
                    >
                      {job.experienceLevel}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <DollarSign className='mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Salary
                    </Text>
                    <Text
                      className='font-semibold'
                      style={{ color: '#10b981' }}
                    >
                      {formatSalary(job)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className='rounded-lg bg-background-100 p-4 text-center dark:bg-background-dark-100'>
                    <Calendar className='mx-auto mb-2 h-8 w-8 text-orange-600 dark:text-orange-400' />
                    <Text
                      strong
                      className='block text-heading dark:text-heading-dark'
                    >
                      Deadline
                    </Text>
                    <Text
                      className='font-semibold'
                      style={{ color: '#F4612E' }}
                    >
                      {job.applicationDeadline
                        ? new Date(job.applicationDeadline).toLocaleDateString()
                        : 'N/A'}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
