'use client';
import React from 'react';
import { Button, Card, Tag, Typography, Space, Tooltip, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Briefcase,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { JobType, ExperienceLevel, JobStatus } from '@/interfaces';
import { useGetJobById } from '@/apis';
import { HtmlRenderer } from '@/components/common';

const { Title } = Typography;

interface JobDetailProps {
  jobId: string;
  mode: 'admin' | 'public';
}

export const JobDetail: React.FC<JobDetailProps> = ({ jobId, mode }) => {
  const router = useRouter();
  const { data: job, isLoading } = useGetJobById(jobId);

  if (isLoading) {
    return (
      <div className='min-h-screen py-8' style={{ backgroundColor: '#232323' }}>
        <div className='mx-auto max-w-4xl px-6'>
          <Skeleton active />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className='flex min-h-screen items-center justify-center'
        style={{ backgroundColor: '#232323' }}
      >
        <div className='text-center'>
          <XCircle
            className='mx-auto mb-4 h-16 w-16'
            style={{ color: '#ef4444' }}
          />
          <h2
            className='mb-2 text-xl font-semibold'
            style={{ color: '#F9FAFB' }}
          >
            Job Not Found
          </h2>
          <p className='mb-4' style={{ color: '#D1D5DB' }}>
            The job you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            type='primary'
            onClick={() => router.push('/admin/jobs')}
            style={{ backgroundColor: '#F4612E', borderColor: '#F4612E' }}
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

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

  const getStatusColor = (status: JobStatus) => {
    const colors = {
      [JobStatus.OPEN]: '#395b50',
      [JobStatus.CLOSED]: '#ef4444',
      [JobStatus.DRAFT]: '#bfab25',
    };
    return colors[status] || '#F4612E';
  };

  const getExperienceLevelLabel = (level: ExperienceLevel) => {
    const labels = {
      [ExperienceLevel.ENTRY]: 'Entry Level',
      [ExperienceLevel.MID]: 'Mid Level',
      [ExperienceLevel.SENIOR]: 'Senior Level',
      [ExperienceLevel.LEAD]: 'Lead Level',
      [ExperienceLevel.EXECUTIVE]: 'Executive Level',
    };
    return labels[level] || level;
  };

  return (
    <div className='min-h-screen py-8' style={{ backgroundColor: '#232323' }}>
      <div className='mx-auto max-w-4xl px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            icon={<ArrowLeft className='h-4 w-4' />}
            onClick={() => router.push('/admin/jobs')}
            className='mb-4'
            style={{
              backgroundColor: '#313131',
              borderColor: '#4d4d4d',
              color: '#D1D5DB',
            }}
          >
            Back to Jobs
          </Button>

          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='mb-3 flex items-center gap-3'>
                <Title level={2} className='mb-0' style={{ color: '#F9FAFB' }}>
                  {job.title}
                </Title>
                <Tag
                  style={{
                    backgroundColor: `${getStatusColor(job.status)}20`,
                    color: getStatusColor(job.status),
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {job.status.toUpperCase()}
                </Tag>
              </div>

              <div className='mb-4 flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <MapPin className='h-4 w-4' style={{ color: '#AFADB5' }} />
                  <span style={{ color: '#D1D5DB' }}>{job.location}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' style={{ color: '#AFADB5' }} />
                  <span style={{ color: '#D1D5DB' }}>
                    Created{' '}
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
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
                  {getExperienceLevelLabel(job.experienceLevel)}
                </Tag>
              </div>
            </div>

            {mode === 'admin' && (
              <Space>
                <Tooltip title='Edit Job'>
                  <Button
                    type='primary'
                    icon={<Edit className='h-4 w-4' />}
                    onClick={() => router.push(`/admin/jobs/create/${job.id}`)}
                    style={{
                      backgroundColor: '#F4612E',
                      borderColor: '#F4612E',
                    }}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title='Delete Job'>
                  <Button
                    danger
                    icon={<Trash2 className='h-4 w-4' />}
                    onClick={() => {
                      // Handle delete
                      console.log('Delete job:', job.id);
                    }}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Space>
            )}
          </div>
        </div>

        {/* Job Details Cards */}
        <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Compensation */}
          <Card
            title={
              <div className='flex items-center gap-2'>
                <DollarSign className='h-5 w-5' style={{ color: '#bfab25' }} />
                <span style={{ color: '#F9FAFB' }}>Compensation</span>
              </div>
            }
            className='border-0'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='text-center'>
              {job.salaryMin && job.salaryMax ? (
                <>
                  <div
                    className='mb-1 text-2xl font-bold'
                    style={{ color: '#F9FAFB' }}
                  >
                    {job.salaryMin.toLocaleString()} -{' '}
                    {job.salaryMax.toLocaleString()}
                  </div>
                  <div style={{ color: '#AFADB5' }}>
                    {job.currency} per year
                  </div>
                </>
              ) : (
                <div className='text-lg' style={{ color: '#AFADB5' }}>
                  Salary Negotiable
                </div>
              )}
            </div>
          </Card>

          {/* Application Deadline */}
          <Card
            title={
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5' style={{ color: '#bfab25' }} />
                <span style={{ color: '#F9FAFB' }}>Deadline</span>
              </div>
            }
            className='border-0'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='text-center'>
              <div
                className='mb-1 text-xl font-semibold'
                style={{ color: '#F9FAFB' }}
              >
                {job.applicationDeadline
                  ? new Date(job.applicationDeadline).toLocaleDateString()
                  : 'Not specified'}
              </div>
              <div style={{ color: '#AFADB5' }}>Application deadline</div>
            </div>
          </Card>

          {/* Applications */}
          <Card
            title={
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5' style={{ color: '#bfab25' }} />
                <span style={{ color: '#F9FAFB' }}>Applications</span>
              </div>
            }
            className='border-0'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='text-center'>
              <div
                className='mb-1 text-2xl font-bold'
                style={{ color: '#F9FAFB' }}
              >
                0
              </div>
              <div style={{ color: '#AFADB5' }}>Total applications</div>
            </div>
          </Card>
        </div>

        {/* Job Description */}
        <Card
          title={
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5' style={{ color: '#F4612E' }} />
              <span style={{ color: '#F9FAFB' }}>Job Description</span>
            </div>
          }
          className='mb-6 border-0'
          style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
        >
          <div style={{ color: '#D1D5DB' }}>
            <HtmlRenderer htmlString={job.description} />
          </div>
        </Card>

        {/* Skills, Requirements, Benefits */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <Card
              title={
                <div className='flex items-center gap-2'>
                  <CheckCircle
                    className='h-5 w-5'
                    style={{ color: '#395b50' }}
                  />
                  <span style={{ color: '#F9FAFB' }}>Required Skills</span>
                </div>
              }
              className='border-0'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <div className='space-y-2'>
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
            </Card>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card
              title={
                <div className='flex items-center gap-2'>
                  <Briefcase className='h-5 w-5' style={{ color: '#6a0136' }} />
                  <span style={{ color: '#F9FAFB' }}>Requirements</span>
                </div>
              }
              className='border-0'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <ul className='space-y-2' style={{ color: '#D1D5DB' }}>
                {job.requirements.map((requirement, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <CheckCircle
                      className='mt-0.5 h-4 w-4 flex-shrink-0'
                      style={{ color: '#395b50' }}
                    />
                    <span className='text-sm'>{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card
              title={
                <div className='flex items-center gap-2'>
                  <CheckCircle
                    className='h-5 w-5'
                    style={{ color: '#1f2f16' }}
                  />
                  <span style={{ color: '#F9FAFB' }}>Benefits</span>
                </div>
              }
              className='border-0'
              style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
            >
              <ul className='space-y-2' style={{ color: '#D1D5DB' }}>
                {job.benefits.map((benefit, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <CheckCircle
                      className='mt-0.5 h-4 w-4 flex-shrink-0'
                      style={{ color: '#1f2f16' }}
                    />
                    <span className='text-sm'>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
