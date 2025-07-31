import React from 'react';
import { Select, SelectProps } from 'antd';

type Props = SelectProps;

export const SelectMailReceiver: React.FC<Props> = ({ ...props }) => {
  const options = [{ value: 'all', label: 'All' }];
  return <Select options={options} {...props} />;
};
