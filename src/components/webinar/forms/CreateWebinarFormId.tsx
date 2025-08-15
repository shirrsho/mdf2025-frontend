'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/libs/toast';
import { WebinarForm } from './WebinarForm';
import { useCreateWebinar, useUpdateWebinar, useGetWebinarById } from '@/apis';
import { IWebinarCreateRequest, IWebinarUpdateRequest } from '@/interfaces';

interface CreateWebinarFormIdProps {
  webinarId?: string;
  mode?: 'admin' | 'company';
}

export const CreateWebinarFormId: React.FC<CreateWebinarFormIdProps> = ({
  webinarId,
  mode = 'admin',
}) => {
  const router = useRouter();

  const getBaseUrl = () => {
    return mode === 'admin' ? '/admin' : '/c';
  };

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
        Toast.success('Webinar updated successfully!');
      } else {
        await createWebinarMutation.mutateAsync(data as IWebinarCreateRequest);
        Toast.success('Webinar created successfully!');
      }
      router.push(`${getBaseUrl()}/webinars`);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${webinarId ? 'update' : 'create'} webinar`;
      Toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push(`${getBaseUrl()}/webinars`);
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
