import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createCompany,
  deleteCompany,
  getAllPublicCompanys,
  getAllCompanys,
  getPublicCompanyById,
  getCompanyById,
  getCompanyOption,
  updateCompany,
} from './apis';
import {
  CREATE_COMPANY,
  DELETE_COMPANY,
  GET_ALL_COMPANY,
  GET_COMPANY_BY_ID,
  GET_COMPANY_OPTIONS,
  UPDATE_COMPANY,
} from './keys';
import { getQueryClient, PaginationResponse, stallQueries } from '@/utils';
import { ICompany } from '@/interfaces';

export const useGetAllCompanys = (queryParams = {}) => {
  return useQuery<PaginationResponse<ICompany>>({
    queryKey: [GET_ALL_COMPANY, queryParams],
    queryFn: async () => await getAllCompanys(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllPublicCompanys = (queryParams = {}) => {
  return useQuery<PaginationResponse<ICompany>>({
    queryKey: [GET_ALL_COMPANY, 'public_company', queryParams],
    queryFn: async () => await getAllPublicCompanys(queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchAllPublicCompanyQueryClient = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_ALL_COMPANY, 'public_company', {}],
    queryFn: getAllPublicCompanys,
  });
  return queryClient;
};

export const useGetCompanyOption = () => {
  return useQuery({
    queryKey: [GET_COMPANY_OPTIONS],
    queryFn: async () => await getCompanyOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetCompanyById = (id?: number | string, queryParams = {}) => {
  return useQuery<ICompany>({
    queryKey: [GET_COMPANY_BY_ID, id, queryParams],
    queryFn: async () => await getCompanyById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetPublicCompanyById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<ICompany>({
    queryKey: [GET_COMPANY_BY_ID, id, queryParams],
    queryFn: async () => await getPublicCompanyById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchPublicCompanyIdQueryClient = (
  id: string,
  queryParams = {}
) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_COMPANY_BY_ID, id, queryParams],
    queryFn: async () => await getPublicCompanyById(id, queryParams),
  });
  return queryClient;
};

export const useCreateCompany = () => {
  return useMutation({
    mutationKey: [CREATE_COMPANY],
    mutationFn: async (data: any) => await createCompany(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_COMPANY);
      await stallQueries(GET_COMPANY_OPTIONS);
    },
  });
};

export const useUpdateCompany = () => {
  return useMutation({
    mutationKey: [UPDATE_COMPANY],
    mutationFn: async (data: any) => await updateCompany(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_COMPANY);
      await stallQueries(GET_COMPANY_OPTIONS);
    },
  });
};

export const useDeleteCompany = () => {
  return useMutation({
    mutationKey: [DELETE_COMPANY],
    mutationFn: async (id: number | string) => await deleteCompany(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_COMPANY);
      await stallQueries(GET_COMPANY_OPTIONS);
    },
  });
};
