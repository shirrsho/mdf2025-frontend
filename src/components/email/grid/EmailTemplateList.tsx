'use client';
import React, { useState } from 'react';
import { Drawer, Form, Spin } from 'antd';
import { toast } from 'react-toastify';
import { IMailBlueprint } from '@/interfaces';
import { Plus } from 'lucide-react';
import {
  useCreateMailBlueprint,
  useGetAllMailBlueprints,
  useUpdateMailBlueprint,
  useDeleteMailBlueprint,
} from '@/apis';
import {
  EmptyState,
  TableTopButton,
  ViewModeToggle,
} from '@/components/common';
import { handleErrorToast } from '@/utils';
import { MailBlueprintCard } from '../cards';
import { MailBlueprintForm } from '../create';

export const EmailTemplateList = () => {
  const [form] = Form.useForm();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, refetch } = useGetAllMailBlueprints();
  const createEmailTemplate = useCreateMailBlueprint();
  const updateMailBlueprint = useUpdateMailBlueprint();
  const deleteMailBlueprint = useDeleteMailBlueprint();

  const handleSubmit = async (values: any) => {
    try {
      if (values.id) {
        await updateMailBlueprint.mutateAsync(values);
        toast.success('Template updated successfully');
      } else {
        await createEmailTemplate.mutateAsync(values);
        toast.success('Template created successfully');
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
      await deleteMailBlueprint.mutateAsync(id);
      toast.success('Template deleted successfully');
      await refetch();
    } catch (error) {
      handleErrorToast(error);
    }
  };

  const onEdit = (mailBlueprint: IMailBlueprint) => {
    form.setFieldsValue(mailBlueprint);
    setIsEditing(true);
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
            text='Add New Template'
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
          message={'No Template Yet'}
          description={`Add first template`}
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
            <MailBlueprintCard
              key={template.id}
              blueprint={template}
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
            {isEditing ? `Edit Template` : `Create New Template`}
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
        <MailBlueprintForm form={form} onFinish={handleSubmit} />
      </Drawer>
    </div>
  );
};
