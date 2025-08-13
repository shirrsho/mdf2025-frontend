import { axios } from '@/utils';
import { WEBINAR } from './endpoints';

export const getAllWebinars = async (queryParams = {}) => {
  const response = await axios.get(`${WEBINAR}`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllPublicWebinars = async (queryParams = {}) => {
  const response = await axios.get(`${WEBINAR}/public`, {
    params: queryParams,
  });
  return response.data;
};

export const getWebinarOption = async () => {
  const response = await axios.get(`${WEBINAR}/option`);
  return response.data;
};

export const getWebinarById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${WEBINAR}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const getPublicWebinarById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${WEBINAR}/public/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createWebinar = async (value: any) => {
  const response = await axios.post(`${WEBINAR}`, value);
  return response.data;
};

export const updateWebinar = async (id: number, value: any) => {
  const response = await axios.patch(`${WEBINAR}/${id}`, value);
  return response.data;
};

export const deleteWebinar = async (id: number | string) => {
  const response = await axios.delete(`${WEBINAR}/${id}`);
  return response.data;
};

export const getWebinarsByTimeslot = async (
  timeslotId?: string,
  queryParams = {}
) => {
  if (!timeslotId) return null;
  const response = await axios.get(`${WEBINAR}`, {
    params: { ...queryParams, timeslot: timeslotId },
  });
  return response.data;
};

export const getAvailableSlots = async (
  timeslotId?: string,
  duration: number = 60
) => {
  if (!timeslotId) return null;
  const response = await axios.get(`${WEBINAR}/available-slots/${timeslotId}`, {
    params: { duration },
  });
  return response.data;
};
