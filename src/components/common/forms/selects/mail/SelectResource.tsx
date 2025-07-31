import React from 'react';
import { Select, SelectProps } from 'antd';
import { useGetResourceOptions } from '@/apis';

type Props = SelectProps;

export const SelectResource: React.FC<Props> = ({ ...props }) => {
  const { data: options, isLoading } = useGetResourceOptions();
  return (
    <Select
      size='large'
      loading={isLoading}
      options={options}
      placeholder='Select resource'
      {...props}
    />
  );
};
