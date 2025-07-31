import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  getAllMailCredentials,
  getMailCredentialOption,
  createMailCredential,
  updateMailCredential,
  deleteMailCredential,
  setDefaultMailCredential,
} from './apis';
import {
  CREATE_MAILCREDENTIAL,
  DELETE_MAILCREDENTIAL,
  GET_ALL_MAILCREDENTIAL,
  GET_MAILCREDENTIAL_OPTIONS,
  UPDATE_MAILCREDENTIAL,
} from './keys';
import { PaginationResponse, stallQueries } from '@/utils';
import { IMailCredential } from '@/interfaces';

export const useGetAllMailCredentials = () => {
  return useQuery<PaginationResponse<IMailCredential>>({
    queryKey: [GET_ALL_MAILCREDENTIAL],
    queryFn: async () => await getAllMailCredentials(),
    staleTime: STALE_TIME,
  });
};

export const useGetMailCredentialOption = () => {
  return useQuery({
    queryKey: [GET_MAILCREDENTIAL_OPTIONS],
    queryFn: async () => await getMailCredentialOption(),
    staleTime: STALE_TIME,
  });
};

export const useCreateMailCredential = () => {
  return useMutation({
    mutationKey: [CREATE_MAILCREDENTIAL],
    mutationFn: async (data: any) => await createMailCredential(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_MAILCREDENTIAL);
      await stallQueries(GET_MAILCREDENTIAL_OPTIONS);
    },
  });
};

export const useUpdateMailCredential = () => {
  return useMutation({
    mutationKey: [UPDATE_MAILCREDENTIAL],
    mutationFn: async (data: any) => await updateMailCredential(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_MAILCREDENTIAL);
      await stallQueries(GET_MAILCREDENTIAL_OPTIONS);
    },
  });
};

export const useDeleteMailCredential = () => {
  return useMutation({
    mutationKey: [DELETE_MAILCREDENTIAL],
    mutationFn: async (id: string) => await deleteMailCredential(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_MAILCREDENTIAL);
      await stallQueries(GET_MAILCREDENTIAL_OPTIONS);
    },
  });
};

export const useSetDefaultMailCredential = () => {
  return useMutation({
    mutationKey: [DELETE_MAILCREDENTIAL],
    mutationFn: async (id: string) => await setDefaultMailCredential(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_MAILCREDENTIAL);
      await stallQueries(GET_MAILCREDENTIAL_OPTIONS);
    },
  });
};
