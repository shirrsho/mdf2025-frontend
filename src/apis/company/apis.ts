import { axios } from '@/utils';
import { COMPANY } from './endpoints';

export const getAllCompanys = async (queryParams = {}) => {
  const response = await axios.get(`${COMPANY}`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllPublicCompanys = async (queryParams = {}) => {
  const response = await axios.get(`${COMPANY}/public`, {
    params: queryParams,
  });
  return response.data;
};

export const getCompanyOption = async () => {
  const response = await axios.get(`${COMPANY}/option`);
  return response.data;
};

export const getCompanyById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${COMPANY}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const getPublicCompanyById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${COMPANY}/public/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createCompany = async (value: any) => {
  const response = await axios.post(`${COMPANY}`, value);
  return response.data;
};

export const updateCompany = async (id: number, value: any) => {
  const response = await axios.patch(`${COMPANY}/${id}`, value);
  return response.data;
};

export const deleteCompany = async (id: number | string) => {
  const response = await axios.delete(`${COMPANY}/${id}`);
  return response.data;
};
