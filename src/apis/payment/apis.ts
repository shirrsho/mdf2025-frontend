import { axios } from '@/utils';
import { PAYMENT } from './endpoints';

export const getAllPayments = async (queryParams = {}) => {
  const response = await axios.get(`${PAYMENT}`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllPublicPayments = async (queryParams = {}) => {
  const response = await axios.get(`${PAYMENT}/public`, {
    params: queryParams,
  });
  return response.data;
};

export const getPaymentOption = async () => {
  const response = await axios.get(`${PAYMENT}/option`);
  return response.data;
};

export const getPaymentById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${PAYMENT}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const getPublicPaymentById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${PAYMENT}/public/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createPayment = async (value: any) => {
  const response = await axios.post(`${PAYMENT}`, value);
  return response.data;
};

export const updatePayment = async (id: number, value: any) => {
  const response = await axios.patch(`${PAYMENT}/${id}`, value);
  return response.data;
};

export const deletePayment = async (id: number | string) => {
  const response = await axios.delete(`${PAYMENT}/${id}`);
  return response.data;
};
