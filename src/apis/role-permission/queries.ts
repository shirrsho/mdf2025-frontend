import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createRolePermission,
  deleteRolePermission,
  getAllRolePermissions,
  getRefreshAdminRolePermission,
  getRolePermissionById,
  getRolePermissionNameOption,
  getRolePermissionOption,
  getUserFrontendPermissions,
  updateRolePermission,
} from './apis';
import {
  CREATE_ROLEPERMISSION,
  DELETE_ROLEPERMISSION,
  GET_ALL_ROLEPERMISSION,
  GET_ROLEPERMISSION_ADMIN_REFRESH,
  GET_ROLEPERMISSION_BY_ID,
  GET_ROLEPERMISSION_NAME_OPTIONS,
  GET_ROLEPERMISSION_OPTIONS,
  GET_ROLEPERMISSION_USER_FRONTEND,
  UPDATE_ROLEPERMISSION,
} from './keys';
import { stallQueries } from '@/utils';

export const useGetAllRolePermissions = (queryParams = {}) => {
  return useQuery({
    queryKey: [GET_ALL_ROLEPERMISSION, queryParams],
    queryFn: async () => await getAllRolePermissions(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetRolePermissionOption = () => {
  return useQuery({
    queryKey: [GET_ROLEPERMISSION_OPTIONS],
    queryFn: async () => await getRolePermissionOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetRolePermissionNameOption = () => {
  return useQuery({
    queryKey: [GET_ROLEPERMISSION_NAME_OPTIONS],
    queryFn: async () => await getRolePermissionNameOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetRolePermissionAdminRefresh = () => {
  return useQuery({
    queryKey: [GET_ROLEPERMISSION_ADMIN_REFRESH],
    queryFn: async () => await getRefreshAdminRolePermission(),
    staleTime: STALE_TIME,
  });
};

export const useGetUserFrontendPermissions = () => {
  return useQuery<string[]>({
    queryKey: [GET_ROLEPERMISSION_USER_FRONTEND],
    queryFn: async () => await getUserFrontendPermissions(),
    staleTime: Infinity,
  });
};

export const useGetRolePermissionById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery({
    queryKey: [GET_ROLEPERMISSION_BY_ID, id, queryParams],
    queryFn: async () => await getRolePermissionById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useCreateRolePermission = () => {
  return useMutation({
    mutationKey: [CREATE_ROLEPERMISSION],
    mutationFn: async (data: any) => await createRolePermission(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_ROLEPERMISSION);
      await stallQueries(GET_ROLEPERMISSION_OPTIONS);
    },
  });
};

export const useUpdateRolePermission = () => {
  return useMutation({
    mutationKey: [UPDATE_ROLEPERMISSION],
    mutationFn: async (data: any) => await updateRolePermission(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_ROLEPERMISSION);
      await stallQueries(GET_ROLEPERMISSION_OPTIONS);
    },
  });
};

export const useDeleteRolePermission = () => {
  return useMutation({
    mutationKey: [DELETE_ROLEPERMISSION],
    mutationFn: async (id: number | string) => await deleteRolePermission(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_ROLEPERMISSION);
      await stallQueries(GET_ROLEPERMISSION_OPTIONS);
    },
  });
};
