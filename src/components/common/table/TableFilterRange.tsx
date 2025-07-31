'use client';
import React, { useState } from 'react';
import { Slider } from 'antd';
import { debounce } from '@/utils';

type TableFilterSliderProps = {
  range: [number, number];
  onRangeChange: (range: [number, number]) => void;
  step?: number;
};

export const TableFilterRange: React.FC<TableFilterSliderProps> = ({
  range,
  onRangeChange,
  step = 1,
}) => {
  const [value, setValue] = useState<[number, number]>(range);

  const debouncedChange = debounce((val: [number, number]) => {
    onRangeChange(val);
  }, 300);

  const handleSliderChange = (val: number[]) => {
    setValue([val[0], val[1]]);
    debouncedChange(val);
  };

  return (
    <div className='px-4'>
      <Slider
        range
        min={range[0]}
        max={range[1]}
        step={step}
        value={value}
        onChange={handleSliderChange}
      />
      <div className='flex justify-between text-sm text-gray-500'>
        <span>{value[0]}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  );
};
