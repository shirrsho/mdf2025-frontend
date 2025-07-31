import { axios } from '@/utils';
import { MAILEVENT, MAILHISTORY } from './endpoints';

export const getAllMailHistory = async (queryParams = {}) => {
  const response = await axios.get(`${MAILHISTORY}`, {
    params: queryParams,
  });
  return response.data;
};

export const getMailHistoryByResourceId = async (
  resource: string,
  queryParams = {}
) => {
  if (!resource) return null;
  const response = await axios.get(`${MAILHISTORY}/resource/${resource}`, {
    params: queryParams,
  });
  return response.data;
};

export const getMailHistoryById = async (id?: string) => {
  if (!id) {
    return null;
  }
  const response = await axios.get(`${MAILHISTORY}/${id}`);
  return response.data;
};

export const resendMail = async (id: string) => {
  const response = await axios.put(`${MAILEVENT}/resend/${id}`);
  return response.data;
};
