'use client';
import React, { useState } from 'react';
import { Input } from 'antd';
import { Search, X } from 'lucide-react';
import { debounce } from '@/utils';

type TableFilterSearchProps = {
  onSearch: (value: string) => void;
  placeholder: string;
};

export const TableFilterSearch: React.FC<TableFilterSearchProps> = ({
  onSearch,
  placeholder,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedOnSearch = debounce(onSearch, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    debouncedOnSearch(value);
  };

  const clearInput = () => {
    if (searchValue !== '') {
      setSearchValue('');
      onSearch('');
    }
  };

  return (
    <Input
      prefix={<Search />}
      style={{ border: '1px solid #d9d9d9' }}
      value={searchValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      suffix={<X size={1} className='cursor-pointer' onClick={clearInput} />}
    />
  );
};
