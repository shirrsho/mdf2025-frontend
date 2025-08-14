'use client';
import React from 'react';
import {
  Button,
  Card,
  Table,
  Tag,
  Space,
  Tooltip,
  Modal,
  notification,
} from 'antd';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { IJob, JobType, ExperienceLevel, JobStatus } from '@/interfaces';
import { handleErrorToast } from '@/utils';
import { AppPagination } from '@/components/common';

const { confirm } = Modal;

interface JobListViewProps {
  jobs: IJob[];
  totalCount: number;
  isLoading: boolean;
  searchParams: {
    page: number;
    limit: number;
    title: string;
    type: string;
    status: string;
  };
  onTableChange: (pagination: any) => void;
  onDelete: (job: IJob) => Promise<void>;
  mode: 'admin' | 'company';
  companyId?: string;
}

export const JobList: React.FC<JobListViewProps> = ({
  jobs,
  totalCount,
  isLoading,
  // searchParams,
  onTableChange,
  onDelete,
  mode,
  companyId,
}) => {
  const router = useRouter();

  const handleDelete = (job: IJob) => {
    confirm({
      title: 'Delete Job',
      content: `Are you sure you want to delete "${job.title}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await onDelete(job);
          notification.success({
            message: 'Success',
            description: 'Job deleted successfully!',
            placement: 'topRight',
          });
        } catch (error) {
          handleErrorToast(error);
        }
      },
    });
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
      [ExperienceLevel.ENTRY]: 'Entry',
      [ExperienceLevel.MID]: 'Mid',
      [ExperienceLevel.SENIOR]: 'Senior',
      [ExperienceLevel.LEAD]: 'Lead',
      [ExperienceLevel.EXECUTIVE]: 'Executive',
    };
    return labels[level] || level;
  };

  const getBaseUrl = () => {
    return mode === 'admin' ? '/admin' : '/c';
  };

  const columns: ColumnsType<IJob> = [
    {
      title: 'Job Details',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (title: string, record: IJob) => (
        <div>
          <div
            className='mb-1 text-base font-semibold'
            style={{ color: '#F9FAFB' }}
          >
            {title}
          </div>
          <div className='mb-2 flex items-center gap-2'>
            <MapPin className='h-3 w-3' style={{ color: '#AFADB5' }} />
            <span className='text-sm' style={{ color: '#D1D5DB' }}>
              {record.location}
            </span>
          </div>
          <div className='flex gap-2'>
            <Tag
              style={{
                backgroundColor: `${getJobTypeColor(record.type)}20`,
                color: getJobTypeColor(record.type),
                border: 'none',
                fontSize: '11px',
              }}
            >
              {record.type.replace('_', ' ').toUpperCase()}
            </Tag>
            <Tag
              style={{
                backgroundColor: '#F4612E20',
                color: '#F4612E',
                border: 'none',
                fontSize: '11px',
              }}
            >
              {getExperienceLevelLabel(record.experienceLevel)}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Compensation',
      key: 'salary',
      width: '15%',
      render: (record: IJob) => (
        <div>
          {record.salaryMin && record.salaryMax ? (
            <div className='flex items-center gap-1'>
              <DollarSign className='h-3 w-3' style={{ color: '#bfab25' }} />
              <span
                className='text-sm font-medium'
                style={{ color: '#F9FAFB' }}
              >
                {record.salaryMin.toLocaleString()}-
                {record.salaryMax.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className='text-sm' style={{ color: '#AFADB5' }}>
              Negotiable
            </span>
          )}
          {record.currency && (
            <div className='mt-1 text-xs' style={{ color: '#AFADB5' }}>
              {record.currency}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      width: '20%',
      render: (skills: string[] = []) => (
        <div className='flex flex-wrap gap-1'>
          {skills.slice(0, 3).map((skill, index) => (
            <Tag
              key={index}
              style={{
                backgroundColor: '#313131',
                color: '#D1D5DB',
                border: '1px solid #4d4d4d',
                fontSize: '10px',
                padding: '2px 6px',
              }}
            >
              {skill}
            </Tag>
          ))}
          {skills.length > 3 && (
            <Tooltip title={skills.slice(3).join(', ')}>
              <Tag
                style={{
                  backgroundColor: '#F4612E20',
                  color: '#F4612E',
                  border: 'none',
                  fontSize: '10px',
                }}
              >
                +{skills.length - 3}
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'applicationDeadline',
      key: 'deadline',
      width: '12%',
      render: (deadline: string) => (
        <div className='flex items-center gap-1'>
          <Calendar className='h-3 w-3' style={{ color: '#AFADB5' }} />
          <span className='text-sm' style={{ color: '#D1D5DB' }}>
            {deadline ? new Date(deadline).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: JobStatus) => (
        <Tag
          style={{
            backgroundColor: `${getStatusColor(status)}20`,
            color: getStatusColor(status),
            border: 'none',
            fontSize: '11px',
            fontWeight: '500',
          }}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '13%',
      render: (record: IJob) => (
        <Space size='small'>
          <Tooltip title='View Details'>
            <Button
              size='small'
              icon={<Eye className='h-3 w-3' />}
              style={{
                backgroundColor: '#313131',
                borderColor: '#4d4d4d',
                color: '#D1D5DB',
              }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`${getBaseUrl()}/jobs/${record.id}`);
              }}
            />
          </Tooltip>
          <Tooltip title='Edit Job'>
            <Button
              size='small'
              icon={<Edit className='h-3 w-3' />}
              style={{
                backgroundColor: '#F4612E',
                borderColor: '#F4612E',
                color: 'white',
              }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(
                  `${getBaseUrl()}/jobs/create/${record.id}?c=${companyId}`
                );
              }}
            />
          </Tooltip>
          <Tooltip title='Delete Job'>
            <Button
              size='small'
              icon={<Trash2 className='h-3 w-3' />}
              style={{
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                color: 'white',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-background-100 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-7xl rounded-md p-6'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-heading dark:text-white'>
              Job Management
            </h1>
            <p className='mt-1 text-paragraph dark:text-gray-200'>
              Manage job postings for the digital job fair
            </p>
          </div>
          <Button
            type='primary'
            size='large'
            icon={<Plus className='h-4 w-4' />}
            onClick={() =>
              router.push(
                `${getBaseUrl()}/jobs/create${companyId ? `?c=${companyId}` : ''}`
              )
            }
            className='h-12 border-primary bg-primary px-6 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
          >
            Create New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className='mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#F4612E20' }}
              >
                <Briefcase className='h-6 w-6' style={{ color: '#F4612E' }} />
              </div>
              <div>
                <p className='text-sm font-medium' style={{ color: '#AFADB5' }}>
                  Total Jobs
                </p>
                <p className='text-2xl font-bold' style={{ color: '#F9FAFB' }}>
                  {totalCount || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#395b5020' }}
              >
                <Users className='h-6 w-6' style={{ color: '#395b50' }} />
              </div>
              <div>
                <p className='text-sm font-medium' style={{ color: '#AFADB5' }}>
                  Active Jobs
                </p>
                <p className='text-2xl font-bold' style={{ color: '#F9FAFB' }}>
                  {
                    jobs.filter((job: IJob) => job.status === JobStatus.OPEN)
                      .length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#bfab2520' }}
              >
                <Calendar className='h-6 w-6' style={{ color: '#bfab25' }} />
              </div>
              <div>
                <p className='text-sm font-medium' style={{ color: '#AFADB5' }}>
                  Draft Jobs
                </p>
                <p className='text-2xl font-bold' style={{ color: '#F9FAFB' }}>
                  {
                    jobs.filter((job: IJob) => job.status === JobStatus.DRAFT)
                      .length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#ef444420' }}
              >
                <Briefcase className='h-6 w-6' style={{ color: '#ef4444' }} />
              </div>
              <div>
                <p className='text-sm font-medium' style={{ color: '#AFADB5' }}>
                  Closed Jobs
                </p>
                <p className='text-2xl font-bold' style={{ color: '#F9FAFB' }}>
                  {
                    jobs.filter((job: IJob) => job.status === JobStatus.CLOSED)
                      .length
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Jobs Table */}
        <Card
          className='border-0 shadow-lg'
          style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
        >
          <Table
            columns={columns}
            dataSource={jobs}
            rowKey={(record) => record.id!}
            onRow={(record) => ({
              onClick: () => router.push(`${getBaseUrl()}/jobs/${record.id}`),
            })}
            pagination={false}
            loading={isLoading}
            onChange={onTableChange}
            size='middle'
            rowClassName={'!cursor-pointer'}
            className='dark-table'
            style={
              {
                '--table-bg': '#2a2a2a',
                '--table-header-bg': '#313131',
                '--table-row-hover-bg': '#313131',
              } as React.CSSProperties
            }
          />
        </Card>

        <div className='mt-6'>
          <AppPagination total={totalCount || 0} />
        </div>
      </div>
    </div>
  );
};
