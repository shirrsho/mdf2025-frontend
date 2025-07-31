import { toast } from 'react-toastify';

export const handleErrorToast = (error: any) => {
  if (error.status === 401) {
    toast.error('You are not authorized to access this resource');
  } else if (error.status === 405) {
    toast.error('Method Not Allowed');
  } else {
    toast.error(
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'An error occurred, please try again later'
    );
  }
};
