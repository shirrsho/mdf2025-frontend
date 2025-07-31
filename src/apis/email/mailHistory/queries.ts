import { useMutation, useQuery } from '@tanstack/react-query';
import { STALE_TIME } from '@/constants';
import {
  getAllMailHistory,
  getMailHistoryById,
  getMailHistoryByResourceId,
  resendMail,
} from './apis';
import {
  GET_ALL_MAILHISTORY,
  GET_MAILHISTORY_BY_ID,
  GET_MAILHISTORY_BY_RESOURCE_ID,
  RESEND_MAIL,
} from './keys';

import { PaginationResponse } from '@/utils';
import { IMailHistory } from '@/interfaces';

export const useGetAllMailHistory = (queryParams = {}) => {
  return useQuery<PaginationResponse<IMailHistory>>({
    queryKey: [GET_ALL_MAILHISTORY, queryParams],
    queryFn: async () => await getAllMailHistory(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetMailHistoryByResource = (
  resource: string,
  queryParams = {}
) => {
  return useQuery<PaginationResponse<IMailHistory>>({
    queryKey: [GET_MAILHISTORY_BY_RESOURCE_ID, resource, queryParams],
    queryFn: async () =>
      await getMailHistoryByResourceId(resource, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetMailHistoryById = (id?: string) => {
  return useQuery<IMailHistory>({
    queryKey: [GET_MAILHISTORY_BY_ID, id],
    queryFn: async () => await getMailHistoryById(id),
    staleTime: STALE_TIME,
  });
};

export const useResendMail = () => {
  return useMutation({
    mutationKey: [RESEND_MAIL],
    mutationFn: async (id: string) => await resendMail(id),
  });
};
