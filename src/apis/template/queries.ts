import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createTemplate,
  deleteTemplate,
  getAllPublicTemplates,
  getAllTemplates,
  getPublicTemplateById,
  getTemplateById,
  getTemplateOption,
  updateTemplate,
} from './apis';
import {
  CREATE_TEMPLATE,
  DELETE_TEMPLATE,
  GET_ALL_TEMPLATE,
  GET_TEMPLATE_BY_ID,
  GET_TEMPLATE_OPTIONS,
  UPDATE_TEMPLATE,
} from './keys';
import { getQueryClient, PaginationResponse, stallQueries } from '@/utils';
import { ITemplate } from '@/interfaces';

export const useGetAllTemplates = (queryParams = {}) => {
  return useQuery<PaginationResponse<ITemplate>>({
    queryKey: [GET_ALL_TEMPLATE, queryParams],
    queryFn: async () => await getAllTemplates(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllPublicTemplates = (queryParams = {}) => {
  return useQuery<PaginationResponse<ITemplate>>({
    queryKey: [GET_ALL_TEMPLATE, 'public_template', queryParams],
    queryFn: async () => await getAllPublicTemplates(queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchAllPublicTemplateQueryClient = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_ALL_TEMPLATE, 'public_template', {}],
    queryFn: getAllPublicTemplates,
  });
  return queryClient;
};

export const useGetTemplateOption = () => {
  return useQuery({
    queryKey: [GET_TEMPLATE_OPTIONS],
    queryFn: async () => await getTemplateOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetTemplateById = (id?: number | string, queryParams = {}) => {
  return useQuery<ITemplate>({
    queryKey: [GET_TEMPLATE_BY_ID, id, queryParams],
    queryFn: async () => await getTemplateById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetPublicTemplateById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<ITemplate>({
    queryKey: [GET_TEMPLATE_BY_ID, id, queryParams],
    queryFn: async () => await getPublicTemplateById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchPublicTemplateIdQueryClient = (
  id: string,
  queryParams = {}
) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_TEMPLATE_BY_ID, id, queryParams],
    queryFn: async () => await getPublicTemplateById(id, queryParams),
  });
  return queryClient;
};

export const useCreateTemplate = () => {
  return useMutation({
    mutationKey: [CREATE_TEMPLATE],
    mutationFn: async (data: any) => await createTemplate(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_TEMPLATE);
      await stallQueries(GET_TEMPLATE_OPTIONS);
    },
  });
};

export const useUpdateTemplate = () => {
  return useMutation({
    mutationKey: [UPDATE_TEMPLATE],
    mutationFn: async (data: any) => await updateTemplate(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_TEMPLATE);
      await stallQueries(GET_TEMPLATE_OPTIONS);
    },
  });
};

export const useDeleteTemplate = () => {
  return useMutation({
    mutationKey: [DELETE_TEMPLATE],
    mutationFn: async (id: number | string) => await deleteTemplate(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_TEMPLATE);
      await stallQueries(GET_TEMPLATE_OPTIONS);
    },
  });
};
