export const handleApiError = (error: any) => {
  return Promise.reject(
    new Error(
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'An error occurred, please try again later'
    )
  );
};
