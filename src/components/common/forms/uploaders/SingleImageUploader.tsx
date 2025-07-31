'use client';
import React from 'react';
import NextImage from 'next/image';
import { Button, FormItemProps, Upload, UploadProps } from 'antd';
import { toast } from 'react-toastify';
import { getAccessToken } from '@/utils';
import { Delete, UploadIcon } from 'lucide-react';

type Props = FormItemProps & {
  onChange?: (value: any) => void;
  value?: string;
  recommendedHeight?: number;
  recommendedWidth?: number;
  forceSize?: boolean;
};

export const SingleImageUploader: React.FC<Props> = ({
  onChange,
  value,
  recommendedHeight,
  recommendedWidth,
  forceSize,
}) => {
  const token = getAccessToken();
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'done') {
      toast.success(`${file.name} file uploaded successfully`);
      onChange && onChange(file.response);
    }
    if (file.status === 'error') {
      toast.error(`${file.name} file upload failed`);
    }
  };

  const handleRemoveImage = () => {
    onChange && onChange(undefined);
  };

  const handleBeforeUpload = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (forceSize && recommendedHeight && recommendedWidth) {
          if (
            img.height !== recommendedHeight ||
            img.width !== recommendedWidth
          ) {
            toast.error(
              `Image must be ${recommendedHeight}x${recommendedWidth} pixels`
            );
            reject();
          }
        }
        resolve();
      };
    });
  };

  return (
    <div className='h-48 overflow-hidden rounded-md border-2 border-dashed border-primary dark:border-primary-dark'>
      {value ? (
        <div className='group relative flex h-48 w-full justify-center'>
          <NextImage
            className='h-48 w-auto'
            src={`${process.env.NEXT_PUBLIC_BUCKET_URI}/${value}`}
            height={500}
            width={500}
            alt='image'
          />
          <div className='absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/50'>
            <Button
              className='invisible group-hover:visible group-hover:bg-danger-dark group-hover:text-white'
              icon={<Delete />}
              onClick={handleRemoveImage}
            />
          </div>
        </div>
      ) : (
        <div className='flex h-full w-full flex-col items-center justify-center gap-[10px] bg-background dark:bg-background-dark'>
          <div className='font-Inter text-gray4 text-[14px] font-semibold'>
            Upload Image
          </div>
          <div className='font-Inter text-gray3 text-center text-[12px] font-medium'>
            Supported files are: JPG, JPEG, PNG
          </div>
          {recommendedHeight && recommendedWidth && (
            <div className='font-Inter text-gray3 text-[12px] font-medium'>
              Recommended size: 490px (height) x 825px (width)
            </div>
          )}
          <Upload
            showUploadList={false}
            action={`${process.env.NEXT_PUBLIC_API_URI}/api/image/v2/upload`}
            onChange={handleChange}
            accept='image/*'
            withCredentials={true}
            headers={{
              Authorization: `Bearer ${token}`,
            }}
            beforeUpload={handleBeforeUpload}
            multiple={false}
            maxCount={1}
          >
            <Button
              style={{ boxShadow: '0px 1px 3px 0px #292E3914' }}
              className='mt-2 h-[38px] rounded-[6px] border-none bg-background dark:bg-background-dark'
              icon={<UploadIcon />}
            >
              Browse files
            </Button>
          </Upload>
        </div>
      )}
    </div>
  );
};
