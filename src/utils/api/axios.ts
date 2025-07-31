import Axios, { AxiosRequestConfig } from 'axios';
import { refreshToken } from '@/apis';
import { getAccessToken } from './getAccessToken';

export const axios = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URI}/api`,
  withCredentials: true,
});

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest: AxiosRequestConfig = error.config;
    if (error.response && error.response.status === 498) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshToken();
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            axios
              .request(config)
              .then((response) => resolve(response))
              .catch((err) => reject(err));
          });
          refreshAndRetryQueue.length = 0;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error(refreshError);
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ resolve, reject, config: originalRequest });
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
