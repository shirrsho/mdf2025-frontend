import { Button, ButtonProps } from 'antd';
import React from 'react';

interface TableTopButtonProps extends ButtonProps {
  text: string;
}

export const TableTopButton: React.FC<TableTopButtonProps> = (props) => {
  return (
    <Button className='h-[30px] !rounded-[4px]' type='primary' {...props}>
      {props.text}
    </Button>
  );
};
