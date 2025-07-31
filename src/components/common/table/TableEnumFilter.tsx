'use client';
import React from 'react';
import { Radio, Space } from 'antd';

type TableEnumFilterProps<T extends string | number> = {
  value?: any;
  onChange?: (value: T | null | '') => void;
  enumObj: Record<string, T>;
};

export function TableEnumFilter<T extends string | number>({
  value,
  onChange,
  enumObj,
}: TableEnumFilterProps<T>) {
  const enumValues = Object.values(enumObj).filter(
    (v) => typeof v === 'string' || typeof v === 'number'
  ) as T[];

  return (
    <div className='m-1'>
      <Radio.Group
        value={value ?? null}
        onChange={(e) => {
          const val = e.target.value;
          onChange?.(val === '__CLEAR__' ? '' : val);
        }}
      >
        <Space direction='vertical'>
          {enumValues.map((key) => (
            <Radio key={String(key)} value={key}>
              {String(key)}
            </Radio>
          ))}
          <Radio value='__CLEAR__'>Clear</Radio>
        </Space>
      </Radio.Group>
    </div>
  );
}
