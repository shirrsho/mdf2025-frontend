import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createJob,
  deleteJob,
  getAllPublicJobs,
  getAllJobs,
  getPublicJobById,
  getJobById,
  getJobOption,
  updateJob,
} from './apis';
import {
  CREATE_JOB,
  DELETE_JOB,
  GET_ALL_JOB,
  GET_JOB_BY_ID,
  GET_JOB_OPTIONS,
  UPDATE_JOB,
} from './keys';
import { getQueryClient, PaginationResponse, stallQueries } from '@/utils';
import { IJob } from '@/interfaces';

export const useGetAllJobs = (queryParams = {}) => {
  return useQuery<PaginationResponse<IJob>>({
    queryKey: [GET_ALL_JOB, queryParams],
    queryFn: async () => await getAllJobs(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllPublicJobs = (queryParams = {}) => {
  return useQuery<PaginationResponse<IJob>>({
    queryKey: [GET_ALL_JOB, 'public_job', queryParams],
    queryFn: async () => await getAllPublicJobs(queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchAllPublicJobQueryClient = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_ALL_JOB, 'public_job', {}],
    queryFn: getAllPublicJobs,
  });
  return queryClient;
};

export const useGetJobOption = () => {
  return useQuery({
    queryKey: [GET_JOB_OPTIONS],
    queryFn: async () => await getJobOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetJobById = (id?: number | string, queryParams = {}) => {
  return useQuery<IJob>({
    queryKey: [GET_JOB_BY_ID, id, queryParams],
    queryFn: async () => await getJobById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetPublicJobById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<IJob>({
    queryKey: [GET_JOB_BY_ID, id, queryParams],
    queryFn: async () => await getPublicJobById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchPublicJobIdQueryClient = (
  id: string,
  queryParams = {}
) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_JOB_BY_ID, id, queryParams],
    queryFn: async () => await getPublicJobById(id, queryParams),
  });
  return queryClient;
};

export const useCreateJob = () => {
  return useMutation({
    mutationKey: [CREATE_JOB],
    mutationFn: async (data: any) => await createJob(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_JOB);
      await stallQueries(GET_JOB_OPTIONS);
    },
  });
};

export const useUpdateJob = () => {
  return useMutation({
    mutationKey: [UPDATE_JOB],
    mutationFn: async (data: any) => await updateJob(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_JOB);
      await stallQueries(GET_JOB_OPTIONS);
    },
  });
};

export const useDeleteJob = () => {
  return useMutation({
    mutationKey: [DELETE_JOB],
    mutationFn: async (id: number | string) => await deleteJob(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_JOB);
      await stallQueries(GET_JOB_OPTIONS);
    },
  });
};
