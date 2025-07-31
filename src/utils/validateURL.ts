import validator from 'validator';

export const validateURL = (_: any, value: string) => {
  return validator.isURL(value)
    ? Promise.resolve()
    : Promise.reject('Please enter a valid URL');
};
