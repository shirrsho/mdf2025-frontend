import { toast } from 'react-toastify';

export const handleErrorToast = (error: any) => {
  toast.error(
    error?.response?.data?.message ||
      error?.response?.message ||
      error?.message ||
      'An error occurred, please try again later'
  );
};
