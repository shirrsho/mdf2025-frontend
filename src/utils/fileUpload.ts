import { axios } from '@/utils';

export const uploadFile = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post('/image/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
