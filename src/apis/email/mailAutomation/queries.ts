import { useMutation, useQuery } from '@tanstack/react-query';
import { STALE_TIME } from '@/constants';
import {
  createMailAutomation,
  deleteMailAutomation,
  getAllMailAutomations,
  getMailAutomationById,
  getMailAutomationOption,
  updateMailAutomation,
  getResourceOptions,
  getAutomationOptions,
  getAutomationPlaceholders,
} from './apis';
import {
  CREATE_MAILAUTOMATION,
  DELETE_MAILAUTOMATION,
  GET_ALL_MAILAUTOMATION,
  GET_MAILAUTOMATION_BY_ID,
  GET_MAILAUTOMATION_OPTIONS,
  UPDATE_MAILAUTOMATION,
  GET_RESOURCE_OPTIONS,
  GET_AUTOMATION_OPTIONS,
  GET_AUTOMATION_PLACEHOLDERS,
} from './keys';
import { PaginationResponse, stallQueries } from '@/utils';
import { IMailAutomation } from '@/interfaces';
import { GET_ALL_MAILBLUEPRINT } from '../mailBlueprint/keys';

export const useGetAllMailAutomations = (queryParams = {}) => {
  return useQuery<PaginationResponse<IMailAutomation>>({
    queryKey: [GET_ALL_MAILAUTOMATION, queryParams],
    queryFn: async () => await getAllMailAutomations(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetMailAutomationOption = () => {
  return useQuery({
    queryKey: [GET_MAILAUTOMATION_OPTIONS],
    queryFn: async () => await getMailAutomationOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetMailAutomationById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery({
    queryKey: [GET_MAILAUTOMATION_BY_ID, id, queryParams],
    queryFn: async () => await getMailAutomationById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useCreateMailAutomation = () => {
  return useMutation({
    mutationKey: [CREATE_MAILAUTOMATION],
    mutationFn: async (data: any) => await createMailAutomation(data),
  });
};

export const useUpdateMailAutomation = () => {
  return useMutation({
    mutationKey: [UPDATE_MAILAUTOMATION],
    mutationFn: async (data: any) => await updateMailAutomation(data.id, data),
  });
};

export const useDeleteMailAutomation = () => {
  return useMutation({
    mutationKey: [DELETE_MAILAUTOMATION],
    mutationFn: async (id?: number | string) => await deleteMailAutomation(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_MAILBLUEPRINT);
    },
  });
};

export const useGetResourceOptions = () => {
  return useQuery({
    queryKey: [GET_RESOURCE_OPTIONS],
    queryFn: async () => await getResourceOptions(),
    staleTime: STALE_TIME,
  });
};

export const useGetMailAutomationOptions = (resource?: string) => {
  return useQuery({
    queryKey: [GET_AUTOMATION_OPTIONS, resource],
    queryFn: async () => await getAutomationOptions(resource),
    staleTime: STALE_TIME,
  });
};

export const useGetMailAutomationPlaceholders = (resource?: string) => {
  return useQuery({
    queryKey: [GET_AUTOMATION_PLACEHOLDERS, resource],
    queryFn: async () => await getAutomationPlaceholders(resource),
    staleTime: STALE_TIME,
  });
};
