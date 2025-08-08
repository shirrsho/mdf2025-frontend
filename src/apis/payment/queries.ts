import { useMutation, useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/constants';
import {
  createPayment,
  deletePayment,
  getAllPublicPayments,
  getAllPayments,
  getPublicPaymentById,
  getPaymentById,
  getPaymentOption,
  updatePayment,
} from './apis';
import {
  CREATE_PAYMENT,
  DELETE_PAYMENT,
  GET_ALL_PAYMENT,
  GET_PAYMENT_BY_ID,
  GET_PAYMENT_OPTIONS,
  UPDATE_PAYMENT,
} from './keys';
import { getQueryClient, PaginationResponse, stallQueries } from '@/utils';
import { IPayment } from '@/interfaces';

export const useGetAllPayments = (queryParams = {}) => {
  return useQuery<PaginationResponse<IPayment>>({
    queryKey: [GET_ALL_PAYMENT, queryParams],
    queryFn: async () => await getAllPayments(queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetAllPublicPayments = (queryParams = {}) => {
  return useQuery<PaginationResponse<IPayment>>({
    queryKey: [GET_ALL_PAYMENT, 'public_payment', queryParams],
    queryFn: async () => await getAllPublicPayments(queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchAllPublicPaymentQueryClient = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_ALL_PAYMENT, 'public_payment', {}],
    queryFn: getAllPublicPayments,
  });
  return queryClient;
};

export const useGetPaymentOption = () => {
  return useQuery({
    queryKey: [GET_PAYMENT_OPTIONS],
    queryFn: async () => await getPaymentOption(),
    staleTime: STALE_TIME,
  });
};

export const useGetPaymentById = (id?: number | string, queryParams = {}) => {
  return useQuery<IPayment>({
    queryKey: [GET_PAYMENT_BY_ID, id, queryParams],
    queryFn: async () => await getPaymentById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const useGetPublicPaymentById = (
  id?: number | string,
  queryParams = {}
) => {
  return useQuery<IPayment>({
    queryKey: [GET_PAYMENT_BY_ID, id, queryParams],
    queryFn: async () => await getPublicPaymentById(id, queryParams),
    staleTime: STALE_TIME,
  });
};

export const prefetchPublicPaymentIdQueryClient = (
  id: string,
  queryParams = {}
) => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: [GET_PAYMENT_BY_ID, id, queryParams],
    queryFn: async () => await getPublicPaymentById(id, queryParams),
  });
  return queryClient;
};

export const useCreatePayment = () => {
  return useMutation({
    mutationKey: [CREATE_PAYMENT],
    mutationFn: async (data: any) => await createPayment(data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_PAYMENT);
      await stallQueries(GET_PAYMENT_OPTIONS);
    },
  });
};

export const useUpdatePayment = () => {
  return useMutation({
    mutationKey: [UPDATE_PAYMENT],
    mutationFn: async (data: any) => await updatePayment(data.id, data),
    onSuccess: async () => {
      await stallQueries(GET_ALL_PAYMENT);
      await stallQueries(GET_PAYMENT_OPTIONS);
    },
  });
};

export const useDeletePayment = () => {
  return useMutation({
    mutationKey: [DELETE_PAYMENT],
    mutationFn: async (id: number | string) => await deletePayment(id),
    onSuccess: async () => {
      await stallQueries(GET_ALL_PAYMENT);
      await stallQueries(GET_PAYMENT_OPTIONS);
    },
  });
};
