import { axios } from '@/utils';
import { ROLEPERMISSION } from './endpoints';

export const getAllRolePermissions = async (queryParams = {}) => {
  const response = await axios.get(`${ROLEPERMISSION}`, {
    params: queryParams,
  });
  return response.data;
};

export const getRolePermissionOption = async () => {
  const response = await axios.get(`${ROLEPERMISSION}/option`);
  return response.data;
};

export const getRolePermissionNameOption = async () => {
  const response = await axios.get(`${ROLEPERMISSION}/name-option`);
  return response.data;
};

export const getRefreshAdminRolePermission = async () => {
  const response = await axios.get(`${ROLEPERMISSION}/refresh-admin`);
  return response.data;
};

export const getUserFrontendPermissions = async () => {
  const response = await axios.get(
    `${ROLEPERMISSION}/user-frontend-permission`
  );
  return response.data;
};

export const getRolePermissionById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${ROLEPERMISSION}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createRolePermission = async (value: any) => {
  const response = await axios.post(`${ROLEPERMISSION}`, value);
  return response.data;
};

export const updateRolePermission = async (id: number, value: any) => {
  const response = await axios.patch(`${ROLEPERMISSION}/${id}`, value);
  return response.data;
};

export const deleteRolePermission = async (id: number | string) => {
  const response = await axios.delete(`${ROLEPERMISSION}/${id}`);
  return response.data;
};
