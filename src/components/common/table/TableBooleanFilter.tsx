'use client';
import React from 'react';
import { Button } from 'antd';

type TableBooleanFilterProps = {
  value?: boolean | null;
  onChange?: (value: boolean | null | '') => void;
};

export const TableBooleanFilter: React.FC<TableBooleanFilterProps> = ({
  value = null,
  onChange,
}) => {
  const handleSelect = (val: boolean | null | '') => {
    onChange?.(val);
  };

  return (
    <div className='m-1 flex flex-col gap-1'>
      <Button
        type={value === true ? 'primary' : 'default'}
        onClick={() => handleSelect(true)}
      >
        Yes
      </Button>
      <Button
        type={value === false ? 'primary' : 'default'}
        onClick={() => handleSelect(false)}
      >
        No
      </Button>
      <Button
        type={value === null ? 'primary' : 'default'}
        onClick={() => handleSelect('')}
      >
        Clear
      </Button>
    </div>
  );
};
