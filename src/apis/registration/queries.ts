import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createRegistration,
  deleteRegistration,
  getAllPublicRegistrations,
  getAllRegistrations,
  getPublicRegistrationById,
  getRegistrationById,
  getRegistrationOption,
  updateRegistration,
} from './apis';
import {
  CREATE_REGISTRATION,
  DELETE_REGISTRATION,
  GET_ALL_REGISTRATION,
  GET_REGISTRATION_BY_ID,
  GET_REGISTRATION_OPTIONS,
  UPDATE_REGISTRATION,
} from './keys';
import { getQueryClient, PaginationResponse, stallQueries } from '@/utils';
import { IRegistration } from '@/interfaces';

export const useGetAllRegistrations = (queryParams = {}) => {
  return useQuery<PaginationResponse<IRegistration>>({
    queryKey: [GET_ALL_REGISTRATION, queryParams],
    queryFn: async () => await getAllRegistrations(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllPublicRegistrations = (queryParams = {}) => {
  return useQuery<PaginationResponse<IRegistration>>({
    queryKey: [GET_ALL_REGISTRATION, 'public_registration', queryParams],
    queryFn: async () => await getAllPublicRegistrations(queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchAllPublicRegistrationQueryClient = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_ALL_REGISTRATION, 'public_registration', {}],
    queryFn: getAllPublicRegistrations,
  });
  return queryClient;
};

export const useGetRegistrationOption = () => {
  return useQuery({
    queryKey: [GET_REGISTRATION_OPTIONS],
    queryFn: async () => await getRegistrationOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetRegistrationById = (id?: number | string, queryParams = {}) => {
  return useQuery<IRegistration>({
    queryKey: [GET_REGISTRATION_BY_ID, id, queryParams],
    queryFn: async () => await getRegistrationById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetPublicRegistrationById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<IRegistration>({
    queryKey: [GET_REGISTRATION_BY_ID, id, queryParams],
    queryFn: async () => await getPublicRegistrationById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchPublicRegistrationIdQueryClient = (
  id: string,
  queryParams = {}
) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_REGISTRATION_BY_ID, id, queryParams],
    queryFn: async () => await getPublicRegistrationById(id, queryParams),
  });
  return queryClient;
};

export const useCreateRegistration = () => {
  return useMutation({
    mutationKey: [CREATE_REGISTRATION],
    mutationFn: async (data: any) => await createRegistration(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_REGISTRATION);
      await stallQueries(GET_REGISTRATION_OPTIONS);
    },
  });
};

export const useUpdateRegistration = () => {
  return useMutation({
    mutationKey: [UPDATE_REGISTRATION],
    mutationFn: async (data: any) => await updateRegistration(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_REGISTRATION);
      await stallQueries(GET_REGISTRATION_OPTIONS);
    },
  });
};

export const useDeleteRegistration = () => {
  return useMutation({
    mutationKey: [DELETE_REGISTRATION],
    mutationFn: async (id: number | string) => await deleteRegistration(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_REGISTRATION);
      await stallQueries(GET_REGISTRATION_OPTIONS);
    },
  });
};
