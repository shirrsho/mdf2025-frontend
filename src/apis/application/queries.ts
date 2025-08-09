import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createApplication,
  deleteApplication,
  getAllPublicApplications,
  getAllApplications,
  getPublicApplicationById,
  getApplicationById,
  getApplicationOption,
  updateApplication,
} from './apis';
import {
  CREATE_APPLICATION,
  DELETE_APPLICATION,
  GET_ALL_APPLICATION,
  GET_APPLICATION_BY_ID,
  GET_APPLICATION_OPTIONS,
  UPDATE_APPLICATION,
} from './keys';
import { getQueryClient, PaginationResponse, stallQueries } from '@/utils';
import { IApplication } from '@/interfaces';

export const useGetAllApplications = (queryParams = {}) => {
  return useQuery<PaginationResponse<IApplication>>({
    queryKey: [GET_ALL_APPLICATION, queryParams],
    queryFn: async () => await getAllApplications(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllPublicApplications = (queryParams = {}) => {
  return useQuery<PaginationResponse<IApplication>>({
    queryKey: [GET_ALL_APPLICATION, 'public_application', queryParams],
    queryFn: async () => await getAllPublicApplications(queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchAllPublicApplicationQueryClient = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_ALL_APPLICATION, 'public_application', {}],
    queryFn: getAllPublicApplications,
  });
  return queryClient;
};

export const useGetApplicationOption = () => {
  return useQuery({
    queryKey: [GET_APPLICATION_OPTIONS],
    queryFn: async () => await getApplicationOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetApplicationById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<IApplication>({
    queryKey: [GET_APPLICATION_BY_ID, id, queryParams],
    queryFn: async () => await getApplicationById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetPublicApplicationById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<IApplication>({
    queryKey: [GET_APPLICATION_BY_ID, id, queryParams],
    queryFn: async () => await getPublicApplicationById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchPublicApplicationIdQueryClient = (
  id: string,
  queryParams = {}
) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_APPLICATION_BY_ID, id, queryParams],
    queryFn: async () => await getPublicApplicationById(id, queryParams),
  });
  return queryClient;
};

export const useCreateApplication = () => {
  return useMutation({
    mutationKey: [CREATE_APPLICATION],
    mutationFn: async (data: any) => await createApplication(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_APPLICATION);
      await stallQueries(GET_APPLICATION_OPTIONS);
    },
  });
};

export const useUpdateApplication = () => {
  return useMutation({
    mutationKey: [UPDATE_APPLICATION],
    mutationFn: async (data: any) => await updateApplication(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_APPLICATION);
      await stallQueries(GET_APPLICATION_OPTIONS);
    },
  });
};

export const useDeleteApplication = () => {
  return useMutation({
    mutationKey: [DELETE_APPLICATION],
    mutationFn: async (id: number | string) => await deleteApplication(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_APPLICATION);
      await stallQueries(GET_APPLICATION_OPTIONS);
    },
  });
};
