import { axios } from '@/utils';
import {
  CHECK_EMAIL,
  FORGOT_PASSWORD,
  GET_ROLE,
  IS_LOGGEDIN,
  LOGGOUT,
  SIGNIN,
  RECEIVE_OTP,
  REFRESH_TOKEN,
  REGISTER,
  SET_PASSWORD,
  VERIFY_EMAIL,
  GET_USER,
  GET_OPTIONAL_USER,
  UPDATE_USER,
} from './endpoints';
import { ACCESS_TOKEN_STORAGE, REFRESH_TOKEN_STORAGE } from '@/constants';
import { stallQueries } from '@/utils';
import { GET_ROLE_KEY, GET_USER_KEY, IS_LOGGEDIN_KEY } from './keys';
import { GET_ROLEPERMISSION_USER_FRONTEND } from '../role-permission/keys';

export const signin = async (values: any) => {
  try {
    const response = await axios.post(SIGNIN, values);
    if (response.data?.status === 'success') {
      await stallQueries(GET_ROLE_KEY);
      await stallQueries(GET_USER_KEY);
      localStorage.setItem(ACCESS_TOKEN_STORAGE, response.data?.accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE, response.data?.refreshToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const signup = async (values: any) => {
  const response = await axios.post(REGISTER, values);
  return response.data;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE);
  if (!refreshToken) {
    return null;
  }
  try {
    const response = await axios.post(REFRESH_TOKEN, {
      token: refreshToken,
    });
    if (response.data?.status === 'success') {
      localStorage.setItem(ACCESS_TOKEN_STORAGE, response.data?.accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE, response.data?.refreshToken);
      return response.data?.accessToken;
    } else {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE);
      return null;
    }
  } catch (error) {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE);
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const checkEmailValidity = async (email: any) => {
  const response = await axios.post(CHECK_EMAIL, { email });
  return response.data;
};

export const verifyEmail = async (email: string, otp: string) => {
  const response = await axios.post(VERIFY_EMAIL, { email, otp });
  return response.data;
};

export const isLoggedIn = async () => {
  try {
    const response = await axios.get(IS_LOGGEDIN);
    if (response.data.status === 'success') {
      return true;
    } else return false;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

export const getRoles = async () => {
  try {
    const response = await axios.get(GET_ROLE);
    if (response.data.status === 'success') {
      return response.data.role;
    } else return [];
  } catch (error) {
    console.error('Error checking login status:', error);
    return [];
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE);
    await axios.get(LOGGOUT);
    await stallQueries(IS_LOGGEDIN_KEY);
    await stallQueries(GET_ROLE_KEY);
    await stallQueries(GET_USER_KEY);
    await stallQueries(GET_ROLEPERMISSION_USER_FRONTEND);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

export const forgetPassword = async (email: string) => {
  const response = await axios.post(FORGOT_PASSWORD, { email });
  return response.data;
};

export const forgotPasswordOtp = async (
  email: string,
  otp: string,
  removeotp: boolean
) => {
  const response = await axios.post(RECEIVE_OTP, { email, otp, removeotp });
  return response.data;
};

export const forgotPasswordOtpNewPassword = async (
  email: string,
  otp: string,
  password: string
) => {
  const response = await axios.post(SET_PASSWORD, {
    email,
    otp,
    password,
  });
  return response.data;
};

export const getUser = async () => {
  const response = await axios.get(GET_USER);
  return response.data;
};

export const getOptionalUser = async () => {
  const response = await axios.get(GET_OPTIONAL_USER);
  return response.data;
};

export const updateUser = async (data: any) => {
  const response = await axios.post(UPDATE_USER, data);
  return response.data;
};
