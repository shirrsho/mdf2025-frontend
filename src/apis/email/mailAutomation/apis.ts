import { axios } from '@/utils';
import { MAILAUTOMATION } from './endpoints';

export const getAllMailAutomations = async (queryParams = {}) => {
  const response = await axios.get(`${MAILAUTOMATION}`, {
    params: queryParams,
  });
  return response.data;
};

export const getMailAutomationOption = async () => {
  const response = await axios.get(`${MAILAUTOMATION}/options`);
  return response.data;
};

export const getMailAutomationById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${MAILAUTOMATION}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createMailAutomation = async (value: any) => {
  const response = await axios.post(`${MAILAUTOMATION}`, value);
  return response.data;
};

export const updateMailAutomation = async (id: number, value: any) => {
  const response = await axios.patch(`${MAILAUTOMATION}/${id}`, value);
  return response.data;
};

export const deleteMailAutomation = async (id?: number | string) => {
  if (!id) return null;
  const response = await axios.delete(`${MAILAUTOMATION}/${id}`);
  return response.data;
};

export const getResourceOptions = async () => {
  const response = await axios.get(`${MAILAUTOMATION}/resource-option`);
  return response.data;
};

export const getAutomationOptions = async (resource?: string) => {
  if (!resource) return Promise.resolve([]);
  const response = await axios.get(
    `${MAILAUTOMATION}/automation-option/${resource}`
  );
  return response.data;
};

export const getAutomationPlaceholders = async (resource?: string) => {
  if (!resource) return Promise.resolve([]);
  const response = await axios.get(
    `${MAILAUTOMATION}/automation-placeholder/${resource}`
  );
  return response.data;
};
