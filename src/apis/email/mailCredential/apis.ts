import { axios } from '@/utils';
import { MAIL } from './endpoints';

export const getAllMailCredentials = async () => {
  const response = await axios.get(`${MAIL}`);
  return response.data;
};

export const getMailCredentialOption = async () => {
  const response = await axios.get(`${MAIL}/option`);
  return response.data;
};

export const createMailCredential = async (value: any) => {
  const response = await axios.post(`${MAIL}`, value);
  return response.data;
};

export const updateMailCredential = async (value: any) => {
  const response = await axios.put(`${MAIL}/${value._id}`, value);
  return response.data;
};

export const deleteMailCredential = async (id: string) => {
  const response = await axios.delete(`${MAIL}/${id}`);
  return response.data;
};

export const setDefaultMailCredential = async (id: string) => {
  const response = await axios.put(`${MAIL}/set-default/${id}`);
  return response.data;
};
