import toast, { ToastOptions } from 'react-hot-toast';

// Default toast configuration
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'bottom-center',
  style: {
    background: '#363636',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

// Success toast configuration
const successOptions: ToastOptions = {
  ...defaultOptions,
  iconTheme: {
    primary: '#10B981',
    secondary: '#FFFFFF',
  },
  style: {
    ...defaultOptions.style,
    background: '#10B981',
    color: '#FFFFFF',
  },
};

// Error toast configuration
const errorOptions: ToastOptions = {
  ...defaultOptions,
  duration: 6000, // Longer duration for errors
  iconTheme: {
    primary: '#EF4444',
    secondary: '#FFFFFF',
  },
  style: {
    ...defaultOptions.style,
    background: '#EF4444',
    color: '#FFFFFF',
  },
};

// Warning toast configuration
const warningOptions: ToastOptions = {
  ...defaultOptions,
  iconTheme: {
    primary: '#F59E0B',
    secondary: '#FFFFFF',
  },
  style: {
    ...defaultOptions.style,
    background: '#F59E0B',
    color: '#FFFFFF',
  },
};

// Info toast configuration
const infoOptions: ToastOptions = {
  ...defaultOptions,
  iconTheme: {
    primary: '#3B82F6',
    secondary: '#FFFFFF',
  },
  style: {
    ...defaultOptions.style,
    background: '#3B82F6',
    color: '#FFFFFF',
  },
};

/**
 * Unified Toast Library
 * Provides consistent toast notifications across the application
 */
export const Toast = {
  /**
   * Show success toast
   */
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...successOptions, ...options });
  },

  /**
   * Show error toast
   */
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...errorOptions, ...options });
  },

  /**
   * Show warning toast
   */
  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...warningOptions,
      ...options,
      icon: '⚠️',
    });
  },

  /**
   * Show info toast
   */
  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...infoOptions,
      ...options,
      icon: 'ℹ️',
    });
  },

  /**
   * Show loading toast
   */
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  },

  /**
   * Show promise toast - handles loading, success, and error states
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, messages, {
      loading: { ...defaultOptions, ...options },
      success: { ...successOptions, ...options },
      error: { ...errorOptions, ...options },
    });
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    return toast.dismiss();
  },

  /**
   * Custom toast with full control
   */
  custom: (jsx: React.ReactElement, options?: ToastOptions) => {
    return toast.custom(jsx, { ...defaultOptions, ...options });
  },
};

/**
 * Error handler function that shows error toasts
 * Replaces the existing handleErrorToast function
 */
export const handleErrorToast = (error: any) => {
  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred';

  Toast.error(errorMessage);
};

// Export the base toast for advanced usage
export { toast as baseToast };

// Export ToastOptions type for TypeScript
export type { ToastOptions };
