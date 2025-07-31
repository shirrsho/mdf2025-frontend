'use client';
import React from 'react';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import { validatePhoneNumber } from '@/utils';
import 'react-phone-input-2/lib/style.css';

type CustomPhoneInputProps = PhoneInputProps & {
  onChange?: (value: string) => void;
  value?: string;
};

export const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  onChange,
  value,
}) => {
  const handleChange = (inputValue: string) => {
    if (onChange) {
      onChange(`+${inputValue.toString()}`);
    }
  };

  return (
    <PhoneInput
      inputStyle={{
        width: '100%',
        background: 'transparent',
      }}
      placeholder='Enter phone number'
      enableSearch={true}
      country={'bd'}
      autoFormat
      countryCodeEditable={false}
      disableSearchIcon
      value={value}
      onChange={handleChange}
      isValid={(inputValue) => {
        return validatePhoneNumber(`+${inputValue}`);
      }}
    />
  );
};
