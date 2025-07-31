import { axios } from '@/utils';
import { TEMPLATE } from './endpoints';

export const getAllTemplates = async (queryParams = {}) => {
  const response = await axios.get(`${TEMPLATE}`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllPublicTemplates = async (queryParams = {}) => {
  const response = await axios.get(`${TEMPLATE}/public`, {
    params: queryParams,
  });
  return response.data;
};

export const getTemplateOption = async () => {
  const response = await axios.get(`${TEMPLATE}/option`);
  return response.data;
};

export const getTemplateById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${TEMPLATE}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const getPublicTemplateById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${TEMPLATE}/public/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createTemplate = async (value: any) => {
  const response = await axios.post(`${TEMPLATE}`, value);
  return response.data;
};

export const updateTemplate = async (id: number, value: any) => {
  const response = await axios.patch(`${TEMPLATE}/${id}`, value);
  return response.data;
};

export const deleteTemplate = async (id: number | string) => {
  const response = await axios.delete(`${TEMPLATE}/${id}`);
  return response.data;
};
