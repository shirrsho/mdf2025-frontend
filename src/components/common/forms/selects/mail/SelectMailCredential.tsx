import React from 'react';
import { Select, SelectProps } from 'antd';
import { useGetMailCredentialOption } from '@/apis';

type Props = SelectProps;

export const SelectMailCredential: React.FC<Props> = ({ ...props }) => {
  const { data: options, isLoading } = useGetMailCredentialOption();
  return <Select loading={isLoading} options={options} {...props} />;
};
