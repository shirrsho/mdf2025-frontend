import React from 'react';
import { Select, SelectProps } from 'antd';
import { useGetMailAutomationOptions } from '@/apis';

type Props = SelectProps & {
  resource: string;
};
export const SelectMailAutomation: React.FC<Props> = ({
  resource,
  ...props
}) => {
  const { data: options, isLoading } = useGetMailAutomationOptions(resource);
  return (
    <Select
      loading={isLoading}
      options={options}
      placeholder='Select automation name'
      {...props}
    />
  );
};
