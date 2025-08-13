import { axios } from '@/utils';
import { TIMESLOT } from './endpoints';

export const getAllTimeslots = async (queryParams = {}) => {
  const response = await axios.get(`${TIMESLOT}`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllPublicTimeslots = async (queryParams = {}) => {
  const response = await axios.get(`${TIMESLOT}/public`, {
    params: queryParams,
  });
  return response.data;
};

export const getAvailableTimeslots = async (queryParams = {}) => {
  const response = await axios.get(`${TIMESLOT}/available`, {
    params: queryParams,
  });
  return response.data;
};

export const getTimeslotOption = async () => {
  const response = await axios.get(`${TIMESLOT}/option`);
  return response.data;
};

export const getTimeslotById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${TIMESLOT}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const getPublicTimeslotById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${TIMESLOT}/public/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createTimeslot = async (value: any) => {
  const response = await axios.post(`${TIMESLOT}`, value);
  return response.data;
};

export const updateTimeslot = async (id: number, value: any) => {
  const response = await axios.patch(`${TIMESLOT}/${id}`, value);
  return response.data;
};

export const deleteTimeslot = async (id: number | string) => {
  const response = await axios.delete(`${TIMESLOT}/${id}`);
  return response.data;
};
