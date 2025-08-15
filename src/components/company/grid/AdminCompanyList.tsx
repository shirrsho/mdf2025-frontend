'use client';
import React from 'react';
import { Table, Button, Space, Tag, Modal } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toast } from '@/libs/toast';
import { useGetAllCompanys, useDeleteCompany } from '@/apis';
import { ICompany, CompanySize } from '@/interfaces';
import { handleErrorToast } from '@/utils';
import { CustomPagination } from '@/components/common';
import Link from 'next/link';
import { ArrowUp, Edit, Trash } from 'lucide-react';

const { confirm } = Modal;

export const AdminCompanyList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('pageno') || '1', 10);
  const limit = parseInt(searchParams.get('pagesize') || '10', 10);
  const name = searchParams.get('name') || '';
  const size = searchParams.get('size') || '';

  const { data, isLoading, refetch } = useGetAllCompanys({
    page,
    limit,
    name,
    size,
  });
  const deleteCompany = useDeleteCompany();

  const updateURLParams = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageno', newPage.toString());
    params.set('pagesize', newPageSize.toString());
    router.push(`?${params.toString()}`);
  };

  const handleTableChange = (pagination: any) => {
    updateURLParams(pagination.current, pagination.pageSize);
  };

  const handleDelete = (company: ICompany) => {
    confirm({
      title: 'Delete Company',
      content: `Are you sure you want to delete "${company.name}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteCompany.mutateAsync(company.id!);
          Toast.success('Company deleted successfully!');
          refetch();
        } catch (error) {
          handleErrorToast(error);
        }
      },
    });
  };

  const getSizeColor = (size: CompanySize) => {
    const colors = {
      [CompanySize.STARTUP]: '#F4612E',
      [CompanySize.SMALL]: '#395b50',
      [CompanySize.MEDIUM]: '#bfab25',
      [CompanySize.LARGE]: '#6a0136',
      [CompanySize.ENTERPRISE]: '#1f2f16',
    };
    return colors[size] || '#F4612E';
  };

  const getSizeLabel = (size: CompanySize) => {
    const labels = {
      [CompanySize.STARTUP]: 'Startup',
      [CompanySize.SMALL]: 'Small',
      [CompanySize.MEDIUM]: 'Medium',
      [CompanySize.LARGE]: 'Large',
      [CompanySize.ENTERPRISE]: 'Enterprise',
    };
    return labels[size] || size;
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: ICompany) => (
        <div className='flex items-center space-x-3'>
          <div className='flex-shrink-0'>
            {record.logoUrl ? (
              <img
                src={record.logoUrl}
                alt={text}
                className='h-10 w-10 rounded-lg border border-background-200 object-cover dark:border-background-dark-300'
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 text-lg font-semibold text-white'>
                {text.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className='font-semibold text-heading dark:text-heading-dark'>
              {text}
            </div>
            <div className='text-sm text-paragraph dark:text-paragraph-dark'>
              {record.industry}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <div className='flex items-center text-paragraph dark:text-paragraph-dark'>
          {location}
        </div>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: CompanySize) => (
        <Tag
          color={getSizeColor(size)}
          className='rounded-full border-0 px-3 py-1 font-medium'
          style={{ color: 'white' }}
        >
          {getSizeLabel(size)}
        </Tag>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string) => (
        <Link
          href={website}
          target='_blank'
          rel='noopener noreferrer'
          className='font-medium text-primary transition-colors hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300'
        >
          <ArrowUp className='rotate-45' />
        </Link>
      ),
    },
    {
      title: 'Contact Info',
      key: 'contact',
      render: (record: ICompany) => (
        <div className='space-y-1'>
          {record.contactEmail && (
            <div className='flex items-center text-sm text-paragraph dark:text-paragraph-dark'>
              {record.contactEmail}
            </div>
          )}
          {record.contactNumber && (
            <div className='flex items-center text-sm text-paragraph dark:text-paragraph-dark'>
              {record.contactNumber}
            </div>
          )}
          {!record.contactEmail && !record.contactNumber && (
            <span className='text-sm text-textColor dark:text-textColor-dark'>
              No contact info
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ICompany) => (
        <Space size='small'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/companies/create/${record.id}`);
            }}
            className='text-yellow-600 hover:text-yellow-700'
          >
            <Edit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            className='text-red-600 hover:text-red-700'
          >
            <Trash />
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-background-100 dark:bg-background-dark-100'>
      <div className='mx-auto max-w-7xl rounded-md p-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-heading dark:text-white'>
                Company Management
              </h1>
              <p className='mt-1 text-paragraph dark:text-gray-200'>
                Manage all registered companies for the job fair
              </p>
            </div>
            <Button
              type='primary'
              size='large'
              onClick={() => router.push('/admin/companies/create')}
              className='h-12 border-primary bg-primary px-6 font-medium text-white hover:border-primary-600 hover:bg-primary-600'
            >
              ✨ Add New Company
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data?.data}
          rowKey={(record) => record.id!}
          onRow={(record) => ({
            onClick: () => router.push(`/admin/companies/${record.id}`),
          })}
          pagination={false}
          loading={isLoading}
          onChange={handleTableChange}
          size='middle'
          rowClassName={'!cursor-pointer'}
        />

        <CustomPagination
          current={page}
          pageSize={limit}
          total={data?.count || 0}
          onChange={(page, pageSize) =>
            handleTableChange({ current: page, pageSize })
          }
          itemType='companies'
        />
      </div>
    </div>
  );
};
