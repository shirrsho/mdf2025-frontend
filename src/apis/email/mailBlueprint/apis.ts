import { axios } from '@/utils';
import { MAILBLUEPRINT } from './endpoints';

export const getAllMailBlueprints = async (queryParams = {}) => {
  const response = await axios.get(`${MAILBLUEPRINT}`, {
    params: queryParams,
  });
  return response.data;
};

export const getMailBlueprintOption = async () => {
  const response = await axios.get(`${MAILBLUEPRINT}/options`);
  return response.data;
};

export const getMailBlueprintPromotionOption = async () => {
  const response = await axios.get(`${MAILBLUEPRINT}/promotion-options`);
  return response.data;
};

export const getMailBlueprintById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${MAILBLUEPRINT}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createMailBlueprint = async (value: any) => {
  const response = await axios.post(`${MAILBLUEPRINT}`, value);
  return response.data;
};

export const updateMailBlueprint = async (id: number, value: any) => {
  const response = await axios.put(`${MAILBLUEPRINT}/${id}`, value);
  return response.data;
};

export const deleteMailBlueprint = async (id?: number | string) => {
  if (!id) return null;
  const response = await axios.delete(`${MAILBLUEPRINT}/${id}`);
  return response.data;
};

export const addMailAutomationWithBlueprint = async (value: any) => {
  const response = await axios.post(
    `${MAILBLUEPRINT}/add-automation-blueprint`,
    value
  );
  return response.data;
};
