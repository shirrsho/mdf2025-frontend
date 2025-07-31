import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserCount,
  getUserOption,
  updateUser,
} from './apis';
import {
  CREATE_USER,
  DELETE_USER,
  GET_ALL_USER,
  GET_ALL_USER_COUNT,
  GET_ALL_USER_OPTION,
  GET_USER_BY_ID,
  UPDATE_USER,
} from './keys';

export const useGetUserCount = (queryParams = {}) => {
  return useQuery({
    queryKey: [GET_ALL_USER_COUNT, queryParams],
    queryFn: async () => await getUserCount(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllUsers = (queryParams = {}) => {
  return useQuery({
    queryKey: [GET_ALL_USER, queryParams],
    queryFn: async () => await getAllUsers(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetUserOption = (queryParams = {}) => {
  return useQuery({
    queryKey: [GET_ALL_USER_OPTION, queryParams],
    queryFn: async () => await getUserOption(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetUserById = (id?: number | string, queryParams = {}) => {
  return useQuery({
    queryKey: [GET_USER_BY_ID, id, queryParams],
    queryFn: async () => await getUserById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationKey: [CREATE_USER],
    mutationFn: async (data: any) => await createUser(data),
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationKey: [UPDATE_USER],
    mutationFn: async (data: any) => await updateUser(data.id, data),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationKey: [DELETE_USER],
    mutationFn: async (id: number | string) => await deleteUser(id),
  });
};
