import { useMutation, useQuery } from '@tanstack/react-query';
import { STALE_TIME } from '@/constants';
import {
  addMailAutomationWithBlueprint,
  createMailBlueprint,
  deleteMailBlueprint,
  getAllMailBlueprints,
  getMailBlueprintById,
  getMailBlueprintOption,
  getMailBlueprintPromotionOption,
  updateMailBlueprint,
} from './apis';
import {
  ADD_MAILAUTOMATION_WITH_BLUEPRINT,
  CREATE_MAILBLUEPRINT,
  DELETE_MAILBLUEPRINT,
  GET_ALL_MAILBLUEPRINT,
  GET_MAILBLUEPRINT_BY_ID,
  GET_MAILBLUEPRINT_OPTIONS,
  UPDATE_MAILBLUEPRINT,
} from './keys';
import { PaginationResponse } from '@/utils';
import { IMailBlueprint } from '@/interfaces';

export const useGetAllMailBlueprints = (queryParams = {}) => {
  return useQuery<PaginationResponse<IMailBlueprint>>({
    queryKey: [GET_ALL_MAILBLUEPRINT, queryParams],
    queryFn: async () => await getAllMailBlueprints(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetMailBlueprintOption = () => {
  return useQuery({
    queryKey: [GET_MAILBLUEPRINT_OPTIONS],
    queryFn: async () => await getMailBlueprintOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetMailBlueprintPromotionOption = () => {
  return useQuery({
    queryKey: [GET_MAILBLUEPRINT_OPTIONS, 'promotion'],
    queryFn: async () => await getMailBlueprintPromotionOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetMailBlueprintById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<IMailBlueprint>({
    queryKey: [GET_MAILBLUEPRINT_BY_ID, id, queryParams],
    queryFn: async () => await getMailBlueprintById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useCreateMailBlueprint = () => {
  return useMutation({
    mutationKey: [CREATE_MAILBLUEPRINT],
    mutationFn: async (data: any) => await createMailBlueprint(data),
  });
};

export const useUpdateMailBlueprint = () => {
  return useMutation({
    mutationKey: [UPDATE_MAILBLUEPRINT],
    mutationFn: async (data: any) => await updateMailBlueprint(data.id, data),
  });
};

export const useDeleteMailBlueprint = () => {
  return useMutation({
    mutationKey: [DELETE_MAILBLUEPRINT],
    mutationFn: async (id?: number | string) => await deleteMailBlueprint(id),
  });
};

export const useAddMailAutomationWithBlueprint = () => {
  return useMutation({
    mutationKey: [ADD_MAILAUTOMATION_WITH_BLUEPRINT],
    mutationFn: async (data: any) => await addMailAutomationWithBlueprint(data),
  });
};
