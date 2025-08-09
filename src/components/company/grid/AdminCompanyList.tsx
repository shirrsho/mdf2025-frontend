'use client';
import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  notification, 
  Input,
  Select,
  Row,
  Col,
  Card 
} from 'antd';
import { useRouter } from 'next/navigation';
import { useGetAllCompanys, useDeleteCompany } from '@/apis';
import { ICompany, CompanySize } from '@/interfaces';
import { handleErrorToast } from '@/utils';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

export const AdminCompanyList = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    name: '',
    size: '',
  });

  const { data, isLoading, refetch } = useGetAllCompanys(searchParams);
  const deleteCompany = useDeleteCompany();

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      name: value,
      page: 1
    }));
  };

  const handleSizeFilter = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      size: value,
      page: 1
    }));
  };

  const handleTableChange = (pagination: any) => {
    setSearchParams(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize
    }));
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
          notification.success({
            message: 'Success',
            description: 'Company deleted successfully!',
            placement: 'topRight',
          });
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
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {record.logoUrl ? (
              <img 
                src={record.logoUrl} 
                alt={text}
                className="w-10 h-10 rounded-lg object-cover border border-background-200 dark:border-background-dark-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                {text.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-heading dark:text-heading-dark">{text}</div>
            <div className="text-sm text-paragraph dark:text-paragraph-dark">{record.industry}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <div className="flex items-center text-paragraph dark:text-paragraph-dark">
          <span className="text-textColor dark:text-textColor-dark mr-1">📍</span>
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
          className="px-3 py-1 rounded-full font-medium border-0"
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
        <a 
          href={website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300 font-medium transition-colors"
        >
          {website.replace(/^https?:\/\//, '').substring(0, 25)}...
        </a>
      ),
    },
    {
      title: 'Contact Info',
      key: 'contact',
      render: (record: ICompany) => (
        <div className="space-y-1">
          {record.contactEmail && (
            <div className="text-sm text-paragraph dark:text-paragraph-dark flex items-center">
              <span className="text-textColor dark:text-textColor-dark mr-1">✉️</span>
              {record.contactEmail}
            </div>
          )}
          {record.contactNumber && (
            <div className="text-sm text-paragraph dark:text-paragraph-dark flex items-center">
              <span className="text-textColor dark:text-textColor-dark mr-1">📞</span>
              {record.contactNumber}
            </div>
          )}
          {!record.contactEmail && !record.contactNumber && (
            <span className="text-textColor dark:text-textColor-dark text-sm">No contact info</span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (record: ICompany) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => router.push(`/admin/companies/${record.id}`)}
            className="text-indigo-600 dark:text-indigo-dark-600 hover:text-indigo-700 dark:hover:text-indigo-dark-500 hover:bg-indigo-50 dark:hover:bg-indigo-dark-50 border-indigo-200 dark:border-indigo-dark-100"
          >
            View
          </Button>
          <Button
            size="small"
            onClick={() => router.push(`/admin/companies/create/${record.id}`)}
            className="text-primary hover:text-primary-600 dark:text-primary-dark dark:hover:text-primary-dark-300 hover:bg-primary-50 dark:hover:bg-primary-dark-100 border-primary-200 dark:border-primary-dark-200"
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => handleDelete(record)}
            className="text-danger dark:text-danger-dark hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
            loading={deleteCompany.isPending}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background-100 dark:bg-background-dark-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-heading dark:text-heading-dark">Company Management</h1>
              <p className="text-paragraph dark:text-paragraph-dark mt-1">Manage all registered companies for the job fair</p>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => router.push('/admin/companies/create')}
              className="bg-primary hover:bg-primary-600 border-primary hover:border-primary-600 px-6 h-12 font-medium text-white"
            >
              ✨ Add New Company
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-6 shadow-sm bg-white dark:bg-background-dark-200 border-background-200 dark:border-background-dark-300">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading dark:text-heading-dark">Search Companies</label>
                <Search
                  placeholder="Search by company name..."
                  onSearch={handleSearch}
                  onChange={(e) => !e.target.value && handleSearch('')}
                  enterButton="Search"
                  size="large"
                  className="w-full"
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading dark:text-heading-dark">Filter by Size</label>
                <Select
                  placeholder="All company sizes"
                  size="large"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={handleSizeFilter}
                  className="dark:bg-background-dark-200"
                >
                  <Option value={CompanySize.STARTUP}>Startup</Option>
                  <Option value={CompanySize.SMALL}>Small</Option>
                  <Option value={CompanySize.MEDIUM}>Medium</Option>
                  <Option value={CompanySize.LARGE}>Large</Option>
                  <Option value={CompanySize.ENTERPRISE}>Enterprise</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-heading dark:text-heading-dark">Quick Stats</label>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="bg-primary-100 dark:bg-primary-dark-200 px-3 py-2 rounded-lg">
                    <span className="text-primary-700 dark:text-primary-dark-300 font-semibold">{data?.count || 0}</span>
                    <span className="text-primary-600 dark:text-primary-dark-400 text-sm ml-1">Total</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Table Section */}
        <Card className="shadow-sm bg-white dark:bg-background-dark-200 border-background-200 dark:border-background-dark-300">
          <Table
            columns={columns}
            dataSource={data?.data}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: searchParams.page,
              pageSize: searchParams.limit,
              total: data?.count,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} companies`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
            className="company-table"
            size="middle"
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </div>
  );
};
