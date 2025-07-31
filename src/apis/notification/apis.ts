import { axios } from '@/utils';
import { NOTIFICATIONS } from './endpoints';

export const getNotificationCount = async (queryParams = {}) => {
  const response = await axios.get(`${NOTIFICATIONS}/count`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllNotifications = async (queryParams = {}) => {
  const response = await axios.get(`${NOTIFICATIONS}`, {
    params: queryParams,
  });
  return response.data;
};

export const updateNotification = async (id: number, value: any) => {
  const response = await axios.patch(`${NOTIFICATIONS}/${id}/read`, value);
  return response.data;
};
