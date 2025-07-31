import { useQuery } from '@tanstack/react-query';
import {
  GET_OPTIONAL_USER_KEY,
  GET_ROLE_KEY,
  GET_USER_KEY,
  IS_LOGGEDIN_KEY,
} from './keys';
import { getOptionalUser, getRoles, getUser, isLoggedIn } from './apis';
import { IUser } from '@/interfaces';

export const useIsLoggedInQuery = () => {
  return useQuery({
    queryKey: [IS_LOGGEDIN_KEY],
    queryFn: async () => await isLoggedIn(),
    staleTime: Infinity,
  });
};

export const useGetRolesQuery = () => {
  return useQuery({
    queryKey: [GET_ROLE_KEY],
    queryFn: async () => await getRoles(),
    staleTime: Infinity,
  });
};

export const useGetUser = () => {
  return useQuery({
    queryKey: [GET_USER_KEY],
    queryFn: async () => await getUser(),
    staleTime: Infinity,
  });
};

export const useGetOptionalUser = () => {
  return useQuery<IUser>({
    queryKey: [GET_OPTIONAL_USER_KEY],
    queryFn: async () => await getOptionalUser(),
    staleTime: Infinity,
    retry: false,
  });
};
