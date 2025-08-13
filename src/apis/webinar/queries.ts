import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createWebinar,
  deleteWebinar,
  getAllPublicWebinars,
  getAllWebinars,
  getAvailableSlots,
  getPublicWebinarById,
  getWebinarById,
  getWebinarOption,
  getWebinarsByTimeslot,
  updateWebinar,
} from './apis';
import {
  CREATE_WEBINAR,
  DELETE_WEBINAR,
  GET_ALL_WEBINAR,
  GET_WEBINAR_BY_ID,
  GET_WEBINAR_OPTIONS,
  UPDATE_WEBINAR,
} from './keys';
import { getQueryClient, PaginationResponse, stallQueries } from '@/utils';
import { IWebinar } from '@/interfaces';

export const useGetAllWebinars = (queryParams = {}) => {
  return useQuery<PaginationResponse<IWebinar>>({
    queryKey: [GET_ALL_WEBINAR, queryParams],
    queryFn: async () => await getAllWebinars(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllPublicWebinars = (queryParams = {}) => {
  return useQuery<PaginationResponse<IWebinar>>({
    queryKey: [GET_ALL_WEBINAR, 'public_webinar', queryParams],
    queryFn: async () => await getAllPublicWebinars(queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchAllPublicWebinarQueryClient = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_ALL_WEBINAR, 'public_webinar', {}],
    queryFn: getAllPublicWebinars,
  });
  return queryClient;
};

export const useGetWebinarOption = () => {
  return useQuery({
    queryKey: [GET_WEBINAR_OPTIONS],
    queryFn: async () => await getWebinarOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetWebinarById = (id?: number | string, queryParams = {}) => {
  return useQuery<IWebinar>({
    queryKey: [GET_WEBINAR_BY_ID, id, queryParams],
    queryFn: async () => await getWebinarById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetPublicWebinarById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<IWebinar>({
    queryKey: [GET_WEBINAR_BY_ID, id, queryParams],
    queryFn: async () => await getPublicWebinarById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchPublicWebinarIdQueryClient = (
  id: string,
  queryParams = {}
) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_WEBINAR_BY_ID, id, queryParams],
    queryFn: async () => await getPublicWebinarById(id, queryParams),
  });
  return queryClient;
};

export const useCreateWebinar = () => {
  return useMutation({
    mutationKey: [CREATE_WEBINAR],
    mutationFn: async (data: any) => await createWebinar(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_WEBINAR);
      await stallQueries(GET_WEBINAR_OPTIONS);
    },
  });
};

export const useUpdateWebinar = () => {
  return useMutation({
    mutationKey: [UPDATE_WEBINAR],
    mutationFn: async (data: any) => await updateWebinar(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_WEBINAR);
      await stallQueries(GET_WEBINAR_OPTIONS);
    },
  });
};

export const useDeleteWebinar = () => {
  return useMutation({
    mutationKey: [DELETE_WEBINAR],
    mutationFn: async (id: number | string) => await deleteWebinar(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_WEBINAR);
      await stallQueries(GET_WEBINAR_OPTIONS);
    },
  });
};

export const useGetWebinarsByTimeslot = (
  timeslotId?: string,
  queryParams = {}
) => {
  return useQuery<PaginationResponse<IWebinar>>({
    queryKey: [GET_ALL_WEBINAR, 'by_timeslot', timeslotId, queryParams],
    queryFn: async () => await getWebinarsByTimeslot(timeslotId, queryParams),
    staleTime: STALE_TIME,
    enabled: !!timeslotId,
  });
};

export const useGetAvailableSlots = (
  timeslotId?: string,
  duration: number = 60
) => {
  return useQuery<{ startTime: Date; endTime: Date }[]>({
    queryKey: ['available_slots', timeslotId, duration],
    queryFn: async () => await getAvailableSlots(timeslotId, duration),
    staleTime: STALE_TIME,
    enabled: !!timeslotId,
  });
};
