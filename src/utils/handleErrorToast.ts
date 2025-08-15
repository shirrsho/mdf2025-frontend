import { Toast } from '@/libs/toast';

export const handleErrorToast = (error: any) => {
  const errorMessage =
    error?.response?.data?.message ||
    error?.response?.message ||
    error?.message ||
    'An error occurred, please try again later';

  Toast.error(errorMessage);
};
