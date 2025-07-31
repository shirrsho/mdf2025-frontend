import { ACCESS_TOKEN_STORAGE } from '@/constants';

export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_STORAGE);
};
