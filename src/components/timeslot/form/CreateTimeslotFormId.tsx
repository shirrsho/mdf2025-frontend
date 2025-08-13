'use client';
import React, { useState } from 'react';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';
import {
  useGetTimeslotById,
  useCreateTimeslot,
  useUpdateTimeslot,
} from '@/apis';
import { handleErrorToast } from '@/utils';
import { TimeslotForm } from './TimeslotForm';
import { ITimeslotCreateRequest } from '@/interfaces';

export interface ICreateTimeslotForm {
  timeslotId?: string;
}

export const CreateTimeslotFormId: React.FC<ICreateTimeslotForm> = ({
  timeslotId,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const { data: timeslotData, isLoading: timeslotLoading } =
    useGetTimeslotById(timeslotId);
  const createTimeslot = useCreateTimeslot();
  const updateTimeslot = useUpdateTimeslot();

  const handleSubmit = async (values: ITimeslotCreateRequest) => {
    setIsLoading(true);
    try {
      const timeslotDataPayload = {
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      };

      if (!!timeslotId && timeslotData?.id) {
        await updateTimeslot.mutateAsync({
          ...timeslotDataPayload,
          id: timeslotData.id,
        });
        notification.success({
          message: 'Success',
          description: 'Timeslot updated successfully!',
          placement: 'topRight',
        });
      } else {
        await createTimeslot.mutateAsync(timeslotDataPayload);
        notification.success({
          message: 'Success',
          description: 'Timeslot created successfully!',
          placement: 'topRight',
        });
      }

      // Redirect to timeslots list
      router.push('/admin/timeslots');
    } catch (error) {
      handleErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (timeslotLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading timeslot details...
        </div>
      </div>
    );
  }

  return (
    <TimeslotForm
      initialData={timeslotData}
      isEdit={!!timeslotId}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
