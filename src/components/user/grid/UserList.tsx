'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Drawer, Form, Table } from 'antd';
import { Plus } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import {
  useCreateUser,
  useDeleteUser,
  useGetAllUsers,
  useUpdateUser,
} from '@/apis';
import { IUser } from '@/interfaces';
import {
  AppPaginationOne,
  ActionButton,
  TableTopButton,
  EmptyState,
} from '@/components/common';
import { handleErrorToast } from '@/utils';
import { CreateUserForm } from '../form';

export const UserList = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = useGetAllUsers({
    query: { page, limit },
  });

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleSubmit = async (values: IUser) => {
    try {
      if (values.id) {
        await updateUser.mutateAsync(values);
        toast.success('User updated successfully');
      } else {
        await createUser.mutateAsync(values);
        toast.success('User created successfully');
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
      await deleteUser.mutateAsync(id);
      toast.success('User deleted successfully');
      await refetch();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const onEdit = (user: IUser) => {
    form.setFieldsValue(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<IUser> = [
    {
      title: 'নাম',
      dataIndex: 'name',
      key: 'name',
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'rolePermission',
      key: 'rolePermission',
    },
    {
      title: 'Actions',
      width: '90px',
      fixed: 'right',
      render: (record) => (
        <div className='flex flex-row gap-1'>
          <ActionButton.Edit onClick={() => onEdit(record)} />
          <ActionButton.Delete size='small' onClick={() => onDelete(record.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-background-100 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex w-full flex-row justify-between'>
          <div className='flex w-[50%] flex-row'>
            <h1 className='mb-6 text-3xl font-bold text-white'>তথ্য</h1>
          </div>
          <div className='flex w-full flex-row justify-end gap-x-1'>
            <TableTopButton
              text='যোগ করুন'
              icon={<Plus />}
              onClick={() => {
                setIsEditing(false);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
        {data?.count === 0 ? (
          <EmptyState message={'No User Yet'} description={`Add first user`} />
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
            <AppPaginationOne
              pageSize={limit}
              pageNo={page}
              total={data?.count || 0}
              setPageNo={setPage}
              setPageSize={setLimit}
            />
          </div>
        )}
      </div>
      <Drawer
        title={
          <h2 className='text-xl font-semibold text-white'>
            {isEditing ? `Edit User` : `Create New User`}
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
      >
        <CreateUserForm form={form} onFinish={handleSubmit} />
      </Drawer>
    </div>
  );
};
