'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { TimeslotForm } from './TimeslotForm';
import {
  useCreateTimeslot,
  useUpdateTimeslot,
  useGetTimeslotById,
} from '@/apis';
import { ITimeslotCreateRequest, ITimeslotUpdateRequest } from '@/interfaces';

interface CreateTimeslotFormIdProps {
  timeslotId?: string;
}

export const CreateTimeslotFormId: React.FC<CreateTimeslotFormIdProps> = ({
  timeslotId,
}) => {
  const router = useRouter();
  const isEditMode = Boolean(timeslotId);

  // Hooks
  const { data: timeslot, isLoading: isLoadingTimeslot } = useGetTimeslotById(
    timeslotId!,
    { enabled: isEditMode }
  );

  const createTimeslotMutation = useCreateTimeslot();
  const updateTimeslotMutation = useUpdateTimeslot();

  const isLoading =
    createTimeslotMutation.isPending ||
    updateTimeslotMutation.isPending ||
    (isEditMode && isLoadingTimeslot);

  const handleSubmit = async (
    data: ITimeslotCreateRequest | ITimeslotUpdateRequest
  ) => {
    try {
      if (isEditMode && timeslotId) {
        await updateTimeslotMutation.mutateAsync({
          id: timeslotId,
          data: data as ITimeslotUpdateRequest,
        });
        message.success('Timeslot updated successfully!');
      } else {
        await createTimeslotMutation.mutateAsync(
          data as ITimeslotCreateRequest
        );
        message.success('Timeslot created successfully!');
      }
      router.push('/admin/timeslots');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${isEditMode ? 'update' : 'create'} timeslot`;
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push('/admin/timeslots');
  };

  if (isEditMode && isLoadingTimeslot) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading timeslot details...
        </div>
      </div>
    );
  }

  if (isEditMode && !timeslot) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Timeslot not found
        </div>
      </div>
    );
  }

  return (
    <TimeslotForm
      mode={isEditMode ? 'edit' : 'create'}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      initialData={timeslot}
      isLoading={isLoading}
    />
  );
};
