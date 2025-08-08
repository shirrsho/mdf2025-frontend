'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Drawer, Form, Table } from 'antd';
import { CheckCircle, Plus, Search } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import {
  useCreateWebinar,
  useDeleteWebinar,
  useGetAllWebinars,
  useUpdateWebinar,
} from '@/apis';
import { IWebinar } from '@/interfaces';
import {
  ActionButton,
  TableTopButton,
  AppPagination,
  TableFilterSearch,
  LogoLoader,
} from '@/components/common';
import { handleErrorToast } from '@/utils';
import { CreateWebinarForm } from '../form';

export const WebinarList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const pageNo = parseInt(searchParams.get('pageno') || '1', 10);
  const pageSize = parseInt(
    searchParams.get('pagesize') || DEFAULT_PAGE_SIZE,
    10
  );

  const [query, setQuery] = useState<any>({
    page: pageNo,
    limit: pageSize,
    where: {},
  });

  const { data, isLoading, refetch } = useGetAllWebinars(query);

  const createWebinar = useCreateWebinar();
  const updateWebinar = useUpdateWebinar();
  const deleteWebinar = useDeleteWebinar();

  useEffect(() => {
    const newQuery: any = {};

    newQuery.page = parseInt(searchParams.get('pageno') || '1', 10);
    newQuery.limit = parseInt(
      searchParams.get('pagesize') || DEFAULT_PAGE_SIZE,
      10
    );

    const filterKeys = ['webinarName'];

    filterKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        if (key.startsWith('min') || key.startsWith('max')) {
          newQuery[key] = parseInt(value, 10);
        } else if (key.endsWith('After') || key.endsWith('Before')) {
          newQuery[key] = new Date(value).toISOString();
        } else if (key.startsWith('is') || key.startsWith('has')) {
          newQuery[key] = value === 'true';
        } else {
          newQuery[key] = value;
        }
      }
    });

    setQuery(newQuery);
  }, [searchParams]);

  const getFilterValue = (key: string) => searchParams.get(key) || '';

  const updateFilter = useCallback(
    (key: string, value: any, isMulti: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (isMulti) {
        params.delete(key);

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v && v !== 'all') {
              params.append(key, v);
            }
          });
        } else if (value && value !== 'all') {
          params.append(key, value);
        }
      } else {
        if (value && value !== 'all') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const handleSubmit = async (values: IWebinar) => {
    try {
      if (values.id) {
        await updateWebinar.mutateAsync(values);
        toast.success('Webinar updated successfully');
      } else {
        await createWebinar.mutateAsync(values);
        toast.success('Webinar created successfully');
      }
      await refetch();
      setIsModalOpen(false);
      setIsEditing(false);
      form.resetFields();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteWebinar.mutateAsync(id);
      toast.success('Webinar deleted successfully');
      await refetch();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const onEdit = (webinar: IWebinar) => {
    form.setFieldsValue(webinar);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<IWebinar> = [
    {
      title: 'Sl',
      key: 'index',
      fixed: 'left',
      width: '60px',
      render: (_, __, index) => (pageNo - 1) * pageSize + index + 1,
    },
    {
      title: 'নাম',
      dataIndex: 'webinarName',
      key: 'webinarName',
      filterIcon: getFilterValue('webinarName') ? <CheckCircle /> : <Search />,
      filterDropdown: (
        <TableFilterSearch
          onSearch={(value) => updateFilter('webinarName', value)}
          placeholder='Search by name'
        />
      ),
    },
    {
      title: 'Actions',
      width: '90px',
      fixed: 'right',
      render: (record) => (
        <div className='flex flex-row gap-1'>
          <ActionButton.Edit href={`/admin/webinar/create/${record.id}`} />
          <ActionButton.Edit
            tooltip='modal edit'
            onClick={() => onEdit(record)}
          />
          <ActionButton.Delete
            size='small'
            onClick={async () => await onDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-background-100 px-4 py-6 dark:bg-background-dark-100 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex w-full flex-row justify-between'>
          <div className='flex w-[50%] flex-row'>
            <TableTopButton text='Clear filter' onClick={resetFilters} />
          </div>
          <div className='flex w-full flex-row justify-end gap-x-1'>
            <TableTopButton
              text='যোগ করুন(modal)'
              icon={<Plus />}
              onClick={() => {
                setIsEditing(false);
                setIsModalOpen(true);
              }}
            />
            <TableTopButton
              text='যোগ করুন'
              href='/admin/webinar/create'
              icon={<Plus />}
            />
          </div>
        </div>
        {isLoading ? (
          <LogoLoader />
        ) : (
          <div className='mt-[20px]'>
            <div className='mb-[55px] overflow-x-auto'>
              <Table
                scroll={{ x: true }}
                columns={columns}
                dataSource={data?.data}
                rowKey={(record) => record.id!}
                pagination={false}
                loading={isLoading}
                className='rounded-md border shadow-sm'
              />
            </div>
            <AppPagination total={data?.count || 0} />
          </div>
        )}
      </div>
      <Drawer
        title={
          <h2 className='text-xl font-semibold text-heading dark:text-heading-dark'>
            {isEditing ? `Edit Webinar` : `Create New Webinar`}
          </h2>
        }
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          form.resetFields();
          setIsEditing(false);
        }}
        placement='right'
        width={600}
        className='dark:bg-background-dark-100'
      >
        <CreateWebinarForm form={form} onFinish={handleSubmit} />
      </Drawer>
    </div>
  );
};
