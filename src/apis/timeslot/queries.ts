import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createTimeslot,
  deleteTimeslot,
  getAllPublicTimeslots,
  getAllTimeslots,
  getAvailableTimeslots,
  getPublicTimeslotById,
  getTimeslotById,
  getTimeslotOption,
  updateTimeslot,
} from './apis';
import {
  CREATE_TIMESLOT,
  DELETE_TIMESLOT,
  GET_ALL_TIMESLOT,
  GET_TIMESLOT_BY_ID,
  GET_TIMESLOT_OPTIONS,
  UPDATE_TIMESLOT,
} from './keys';
import { getQueryClient, PaginationResponse, stallQueries } from '@/utils';
import { ITimeslot } from '@/interfaces';

export const useGetAllTimeslots = (queryParams = {}) => {
  return useQuery<PaginationResponse<ITimeslot>>({
    queryKey: [GET_ALL_TIMESLOT, queryParams],
    queryFn: async () => await getAllTimeslots(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllPublicTimeslots = (queryParams = {}) => {
  return useQuery<PaginationResponse<ITimeslot>>({
    queryKey: [GET_ALL_TIMESLOT, 'public_timeslot', queryParams],
    queryFn: async () => await getAllPublicTimeslots(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAvailableTimeslots = (queryParams = {}) => {
  return useQuery<PaginationResponse<ITimeslot>>({
    queryKey: [GET_ALL_TIMESLOT, 'available_timeslot', queryParams],
    queryFn: async () => await getAvailableTimeslots(queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchAllPublicTimeslotQueryClient = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_ALL_TIMESLOT, 'public_timeslot', {}],
    queryFn: getAllPublicTimeslots,
  });
  return queryClient;
};

export const useGetTimeslotOption = () => {
  return useQuery({
    queryKey: [GET_TIMESLOT_OPTIONS],
    queryFn: async () => await getTimeslotOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetTimeslotById = (id?: number | string, queryParams = {}) => {
  return useQuery<ITimeslot>({
    queryKey: [GET_TIMESLOT_BY_ID, id, queryParams],
    queryFn: async () => await getTimeslotById(id, queryParams),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
};

export const useGetPublicTimeslotById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<ITimeslot>({
    queryKey: [GET_TIMESLOT_BY_ID, id, queryParams],
    queryFn: async () => await getPublicTimeslotById(id, queryParams),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
};

export const prefetchPublicTimeslotIdQueryClient = (
  id: string,
  queryParams = {}
) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_TIMESLOT_BY_ID, id, queryParams],
    queryFn: async () => await getPublicTimeslotById(id, queryParams),
  });
  return queryClient;
};

export const useCreateTimeslot = () => {
  return useMutation({
    mutationKey: [CREATE_TIMESLOT],
    mutationFn: async (data: any) => await createTimeslot(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_TIMESLOT);
      await stallQueries(GET_TIMESLOT_OPTIONS);
    },
  });
};

export const useUpdateTimeslot = () => {
  return useMutation({
    mutationKey: [UPDATE_TIMESLOT],
    mutationFn: async (data: any) => await updateTimeslot(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_TIMESLOT);
      await stallQueries(GET_TIMESLOT_OPTIONS);
    },
  });
};

export const useDeleteTimeslot = () => {
  return useMutation({
    mutationKey: [DELETE_TIMESLOT],
    mutationFn: async (id: number | string) => await deleteTimeslot(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_TIMESLOT);
      await stallQueries(GET_TIMESLOT_OPTIONS);
    },
  });
};
