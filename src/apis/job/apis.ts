import { axios } from '@/utils';
import { JOB } from './endpoints';

export const getAllJobs = async (queryParams = {}) => {
  const response = await axios.get(`${JOB}`, {
    params: queryParams,
  });
  return response.data;
};

export const getAllPublicJobs = async (queryParams = {}) => {
  const response = await axios.get(`${JOB}/public`, {
    params: queryParams,
  });
  return response.data;
};

export const getJobOption = async () => {
  const response = await axios.get(`${JOB}/option`);
  return response.data;
};

export const getJobById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${JOB}/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const getPublicJobById = async (
  id?: number | string,
  queryParams = {}
) => {
  if (!id) return null;
  const response = await axios.get(`${JOB}/public/${id}`, {
    params: queryParams,
  });
  return response.data;
};

export const createJob = async (value: any) => {
  const response = await axios.post(`${JOB}`, value);
  return response.data;
};

export const updateJob = async (id: number, value: any) => {
  const response = await axios.patch(`${JOB}/${id}`, value);
  return response.data;
};

export const deleteJob = async (id: number | string) => {
  const response = await axios.delete(`${JOB}/${id}`);
  return response.data;
};
