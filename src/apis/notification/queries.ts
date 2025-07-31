import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  getAllNotifications,
  getNotificationCount,
  updateNotification,
} from './apis';
import {
  GET_ALL_NOTIFICATION,
  GET_ALL_NOTIFICATION_COUNT,
  UPDATE_NOTIFICATION,
} from './keys';

export const useGetNotificationCount = (queryParams = {}) => {
  return useQuery({
    queryKey: [GET_ALL_NOTIFICATION_COUNT, queryParams],
    queryFn: async () => await getNotificationCount(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllNotifications = (queryParams = {}) => {
  return useQuery({
    queryKey: [GET_ALL_NOTIFICATION, queryParams],
    queryFn: async () => await getAllNotifications(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useUpdateNotification = () => {
  return useMutation({
    mutationKey: [UPDATE_NOTIFICATION],
    mutationFn: async (data: any) => await updateNotification(data.id, data),
  });
};
