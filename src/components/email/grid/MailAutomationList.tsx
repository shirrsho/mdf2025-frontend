'use client';
import React, { useState } from 'react';
import { Drawer, Form, Spin } from 'antd';
import { Toast } from '@/libs/toast';
import { Plus } from 'lucide-react';
import {
  useGetAllMailAutomations,
  useUpdateMailAutomation,
  useDeleteMailAutomation,
  useAddMailAutomationWithBlueprint,
} from '@/apis';
import {
  EmptyState,
  TableTopButton,
  ViewModeToggle,
} from '@/components/common';
import { IMailAutomation } from '@/interfaces';
import { handleErrorToast } from '@/utils';
import { MailAutomationCard } from '../cards';
import { MailAutomationForm } from '../create';

export const MailAutomationList = () => {
  const [form] = Form.useForm();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, refetch } = useGetAllMailAutomations();
  const addMailAutomationWithBlueprint = useAddMailAutomationWithBlueprint();
  const updateMailAutomation = useUpdateMailAutomation();
  const deleteMailAutomation = useDeleteMailAutomation();

  const handleSubmit = async (values: any) => {
    try {
      if (values.id) {
        await updateMailAutomation.mutateAsync(values);
        Toast.success('Automation updated successfully');
      } else {
        await addMailAutomationWithBlueprint.mutateAsync(values);
        Toast.success('Automation created successfully');
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
      await deleteMailAutomation.mutateAsync(id);
      Toast.success('Automation deleted successfully');
      await refetch();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const onEdit = (mailAutomation: IMailAutomation) => {
    setIsEditing(true);
    form.setFieldsValue(mailAutomation);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className='flex h-[50vh] items-center justify-center dark:bg-background-dark'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='bg-background p-4 transition-colors duration-200 dark:bg-background-dark md:p-6'>
      <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center md:mb-8'>
        <ViewModeToggle activeMode={viewMode} onViewModeChange={setViewMode} />
        <div className='mt-2 flex w-full flex-row justify-end'>
          <TableTopButton
            text='Add New Automation'
            icon={<Plus />}
            onClick={() => {
              setIsEditing(false);
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>

      <div className='mb-6 flex flex-col items-start justify-end gap-4 sm:flex-row sm:items-center'></div>

      {data?.count === 0 ? (
        <EmptyState
          message={'No Automation Yet'}
          description={`Add first automation`}
        />
      ) : (
        <div
          className={`grid gap-4 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {data?.data?.map((template) => (
            <MailAutomationCard
              key={template.id}
              automation={template}
              onEdit={() => {
                onEdit(template);
              }}
              onDelete={() => onDelete(template.id)}
            />
          ))}
        </div>
      )}

      <Drawer
        title={
          <h2 className='text-xl font-semibold text-heading dark:text-heading-dark'>
            {isEditing ? `Edit Automation` : `Create New Automation`}
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
        <MailAutomationForm
          form={form}
          onFinish={handleSubmit}
          isEaditing={isEditing}
        />
      </Drawer>
    </div>
  );
};
