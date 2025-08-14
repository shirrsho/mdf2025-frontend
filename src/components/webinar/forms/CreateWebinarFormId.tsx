'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { WebinarForm } from './WebinarForm';
import { useCreateWebinar, useUpdateWebinar, useGetWebinarById } from '@/apis';
import { IWebinarCreateRequest, IWebinarUpdateRequest } from '@/interfaces';

interface CreateWebinarFormIdProps {
  webinarId?: string;
}

export const CreateWebinarFormId: React.FC<CreateWebinarFormIdProps> = ({
  webinarId,
}) => {
  const router = useRouter();

  // Hooks
  const { data: webinar, isLoading: isLoadingWebinar } = useGetWebinarById(
    webinarId!
    // { enabled: isEditMode }
  );

  const createWebinarMutation = useCreateWebinar();
  const updateWebinarMutation = useUpdateWebinar();

  const handleSubmit = async (
    data: IWebinarCreateRequest | IWebinarUpdateRequest
  ) => {
    try {
      if (webinarId) {
        await updateWebinarMutation.mutateAsync({
          id: webinarId,
          ...data,
        });
        message.success('Webinar updated successfully!');
      } else {
        await createWebinarMutation.mutateAsync(data as IWebinarCreateRequest);
        message.success('Webinar created successfully!');
      }
      router.push('/admin/webinars');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${webinarId ? 'update' : 'create'} webinar`;
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push('/admin/webinars');
  };

  if (isLoadingWebinar) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Loading webinar details...
        </div>
      </div>
    );
  }

  if (!webinar && webinarId) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background-100 dark:bg-background-dark-100'>
        <div className='text-lg text-paragraph dark:text-paragraph-dark'>
          Webinar not found
        </div>
      </div>
    );
  }

  return (
    <WebinarForm
      mode={webinarId ? 'edit' : 'create'}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      initialData={webinar}
      isLoading={isLoadingWebinar}
    />
  );
};
