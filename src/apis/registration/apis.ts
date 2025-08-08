import { axios } from '@/utils';
import { REGISTRATION } from './endpoints';

export const getAllRegistrations = async (queryParams = {}) => {
  const response = await axios.get(`${REGISTRATION}`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllPublicRegistrations = async (queryParams = {}) => {
  const response = await axios.get(`${REGISTRATION}/public`, {
    params: queryParams,
  });
  return response.data;
};

export const getRegistrationOption = async () => {
  const response = await axios.get(`${REGISTRATION}/option`);
  return response.data;
};

export const getRegistrationById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${REGISTRATION}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const getPublicRegistrationById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${REGISTRATION}/public/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createRegistration = async (value: any) => {
  const response = await axios.post(`${REGISTRATION}`, value);
  return response.data;
};

export const updateRegistration = async (id: number, value: any) => {
  const response = await axios.patch(`${REGISTRATION}/${id}`, value);
  return response.data;
};

export const deleteRegistration = async (id: number | string) => {
  const response = await axios.delete(`${REGISTRATION}/${id}`);
  return response.data;
};
