'use client';
import React from 'react';
import { Button, Card, Table, Tag, Space, Tooltip, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { Toast } from '@/libs/toast';
import {
  Plus,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { IJob, JobType, JobStatus } from '@/interfaces';
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
          Toast.success('Job deleted successfully!');
        } catch (error) {
          handleErrorToast(error);
        }
      },
    });
  };

  const getJobTypeColor = (type: JobType) => {
    const colors = {
      [JobType.FULL_TIME]: '#10B981', // Emerald green
      [JobType.PART_TIME]: '#F59E0B', // Amber
      [JobType.CONTRACT]: '#8B5CF6', // Violet
      [JobType.INTERNSHIP]: '#06B6D4', // Cyan
      [JobType.REMOTE]: '#6366F1', // Indigo
    };
    return colors[type] || '#10B981';
  };

  const getStatusColor = (status: JobStatus) => {
    const colors = {
      [JobStatus.OPEN]: '#10B981', // Emerald green for active/open
      [JobStatus.CLOSED]: '#EF4444', // Red for closed
    };
    return colors[status] || '#10B981';
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
          <div>{record?.company?.name}</div>
        </div>
      ),
    },
    {
      title: 'Compensation',
      key: 'salary',
      width: '20%',
      render: (record: IJob) => (
        <div className='whitespace-nowrap'>
          {record.salaryMin && record.salaryMax ? (
            <div className='flex items-center gap-1'>
              {record.currency && record.salaryMin && record.salaryMax && (
                <div style={{ color: '#AFADB5' }}>{record.currency}</div>
              )}
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
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      render: (type: JobType) => (
        <Tag
          style={{
            backgroundColor: `${getJobTypeColor(type)}20`,
            color: getJobTypeColor(type),
            border: 'none',
            fontSize: '11px',
          }}
        >
          {type.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experienceLevel',
      key: 'experienceLevel',
      width: '10%',
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
                  mode == 'company'
                    ? `${getBaseUrl()}/jobs/create/${record.id}?c=${companyId}`
                    : `${getBaseUrl()}/jobs/create/${record.id}`
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
        <div className='mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3'>
          <Card
            className='border-0 shadow-sm'
            style={{ backgroundColor: '#2a2a2a', borderRadius: '12px' }}
          >
            <div className='flex items-center'>
              <div
                className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg'
                style={{ backgroundColor: '#10B98120' }}
              >
                <Briefcase className='h-6 w-6' style={{ color: '#10B981' }} />
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
                style={{ backgroundColor: '#10B98120' }}
              >
                <Users className='h-6 w-6' style={{ color: '#10B981' }} />
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
                style={{ backgroundColor: '#EF444420' }}
              >
                <Briefcase className='h-6 w-6' style={{ color: '#EF4444' }} />
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
