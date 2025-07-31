import React from 'react';
import { Select, SelectProps } from 'antd';
import { useGetMailBlueprintPromotionOption } from '@/apis';

type Props = SelectProps;

export const SelectMailBlueprintPromotion: React.FC<Props> = ({ ...props }) => {
  const { data: options, isLoading } = useGetMailBlueprintPromotionOption();
  return <Select loading={isLoading} options={options} {...props} />;
};
