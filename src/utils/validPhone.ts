import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhoneNumber = (phoneNumber: string) => {
  try {
    const parsedNumber = phoneUtil.parse(phoneNumber);
    const isValid = phoneUtil.isValidNumber(parsedNumber);
    return isValid;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return false;
  }
};
