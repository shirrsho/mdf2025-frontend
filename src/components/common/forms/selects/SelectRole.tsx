import React from 'react';
import { Select, SelectProps } from 'antd';
import { useGetRolePermissionNameOption } from '@/apis';

type Props = SelectProps;
export const SelectRole: React.FC<Props> = ({ ...props }) => {
  const { data: options, isLoading } = useGetRolePermissionNameOption();
  return <Select loading={isLoading} options={options} {...props} />;
};
