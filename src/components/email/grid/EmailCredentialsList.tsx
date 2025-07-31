'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Drawer, Form, Table, Tooltip } from 'antd';
import { CircleCheck, Plus, Verified } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import {
  useCreateMailCredential,
  useDeleteMailCredential,
  useGetAllMailCredentials,
  useSetDefaultMailCredential,
  useUpdateMailCredential,
} from '@/apis';
import { IMailCredential } from '@/interfaces';
import { ActionButton, TableTopButton, EmptyState } from '@/components/common';
import { handleErrorToast } from '@/utils';
import { CreateEmailCredentialsForm } from '../create';

export const EmailCredentialsList = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, refetch } = useGetAllMailCredentials();

  const createMailCredential = useCreateMailCredential();
  const updateMailCredential = useUpdateMailCredential();
  const deleteMailCredential = useDeleteMailCredential();
  const setDefaultMailCredential = useSetDefaultMailCredential();

  const handleSubmit = async (values: IMailCredential) => {
    try {
      if (values._id) {
        await updateMailCredential.mutateAsync(values);
        toast.success('Mail Credential updated successfully');
      } else {
        await createMailCredential.mutateAsync(values);
        toast.success('Mail Credential created successfully');
      }
      await refetch();
      setIsModalOpen(false);
      setIsEditing(false);
      form.resetFields();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const onChangeDefault = async (id?: string) => {
    if (!id) return;
    try {
      await setDefaultMailCredential.mutateAsync(id);
      toast.success('Default Mail Credential set successfully');
      await refetch();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteMailCredential.mutateAsync(id);
      toast.success('Mail Credential deleted successfully');
      await refetch();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const columns: ColumnsType<IMailCredential> = [
    {
      title: 'Sl',
      key: 'index',
      fixed: 'left',
      width: '60px',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'transporterName',
      key: 'transporterName',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          {record?.isDefault && <Verified color='#60c5ff' />}
          {record?.transporterName}
        </div>
      ),
    },
    {
      title: 'Host',
      dataIndex: 'smtpHost',
      key: 'smtpHost',
    },
    {
      title: 'Port',
      dataIndex: 'smtpPort',
      key: 'smtpPort',
    },
    {
      title: 'From email',
      dataIndex: 'smtpFrom',
      key: 'smtpFrom',
    },
    {
      title: 'User email',
      dataIndex: 'smtpUser',
      key: 'smtpUser',
    },
    {
      title: 'Password',
      dataIndex: 'smtpPassword',
      key: 'smtpPassword',
    },
    {
      title: 'Actions',
      width: '90px',
      fixed: 'right',
      render: (record) => (
        <div className='flex flex-row gap-1'>
          <ActionButton.Delete
            size='small'
            onClick={async () => await onDelete(record._id)}
          />
          <Tooltip title={'Set Default'}>
            <Button
              size='middle'
              type='text'
              disabled={record.isDefault}
              onClick={async () => await onChangeDefault(record._id)}
              icon={
                <CircleCheck
                  className={`hover:scale-105 ${
                    record.isDefault
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-primary dark:text-primary-400'
                  }`}
                />
              }
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-background-100 px-4 py-6 dark:bg-background-dark-100 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex w-full flex-row justify-between'>
          <div className='flex w-[50%] flex-row'></div>
          <div className='flex w-full flex-row justify-end gap-x-1'>
            <TableTopButton
              text='Add'
              icon={<Plus />}
              onClick={() => {
                setIsEditing(false);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
        {data?.count === 0 ? (
          <EmptyState
            message={'No Mail Credential Yet'}
            description={`Add first mail credential`}
          />
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
          </div>
        )}
      </div>
      <Drawer
        title={
          <h2 className='text-xl font-semibold text-heading dark:text-heading-dark'>
            {isEditing ? `Edit Mail Credential` : `Create New Mail Credential`}
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
        <CreateEmailCredentialsForm form={form} onFinish={handleSubmit} />
      </Drawer>
    </div>
  );
};
