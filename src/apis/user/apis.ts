import { axios } from '@/utils';
import { USER } from './endpoints';

export const getUserCount = async (queryParams = {}) => {
  const response = await axios.get(`${USER}/count`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllUsers = async (queryParams = {}) => {
  const response = await axios.get(`${USER}`, {
    params: queryParams,
  });
  return response.data;
};

export const getUserOption = async (queryParams = {}) => {
  const response = await axios.get(`${USER}/options`, {
    params: queryParams,
  });
  return response.data;
};

export const getUserById = async (id?: number | string, queryParams = {}) => {
  if (!id) return null;
  const response = await axios.get(`${USER}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createUser = async (value: any) => {
  const response = await axios.post(`${USER}/adduser`, value);
  return response.data;
};

export const updateUser = async (id: number, value: any) => {
  const response = await axios.put(`${USER}/adduser/${id}`, value);
  return response.data;
};

export const deleteUser = async (id: number | string) => {
  const response = await axios.delete(`${USER}/${id}`);
  return response.data;
};
