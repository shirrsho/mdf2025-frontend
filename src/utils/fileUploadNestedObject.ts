import { uploadFile } from './fileUpload';

export const fileUploadNestedObjects = async (obj: any): Promise<void> => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const value = obj[i];
      if (value instanceof File) {
        const fileUrl = await uploadFile(value);
        obj[i] = fileUrl;
      } else if (typeof value === 'object' && value !== null) {
        await fileUploadNestedObjects(value);
      }
    }
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value instanceof File) {
          const fileUrl = await uploadFile(value);
          obj[key] = fileUrl;
        } else if (typeof value === 'object' && value !== null) {
          await fileUploadNestedObjects(value);
        }
      }
    }
  }
};
