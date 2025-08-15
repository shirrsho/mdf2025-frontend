'use client';
import React from 'react';
import { Button, Upload, UploadProps } from 'antd';
import { Toast } from '@/libs/toast';
import { UploadIcon } from 'lucide-react';

interface ViedoUploaderProps {
  name: string;
  onChange?: (file: File) => void;
}

export const VideoUploader: React.FC<ViedoUploaderProps> = ({
  name,
  onChange,
}) => {
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'done') {
      Toast.success(`${file.name} file uploaded successfully`);
      onChange && onChange(file.response);
    }
    if (file.status === 'error') {
      Toast.error(`${file.name} file upload failed`);
    }
  };

  return (
    <div className='h-48 overflow-hidden rounded-md border-2 border-dashed border-primary'>
      <div className='flex h-full w-full flex-col items-center justify-center gap-[10px] bg-background dark:bg-background-dark'>
        <div className='font-Inter text-gray4 text-[14px] font-semibold'>
          Upload Video
        </div>
        <div className='font-Inter text-gray3 text-center text-[12px] font-medium'>
          Supported files are: mp4, blueray etc.
        </div>
        <label htmlFor={`file-upload-${name}`}>
          <Upload
            showUploadList={false}
            action={`${process.env.NEXT_PUBLIC_API_URI}/api/image/v2/upload`}
            onChange={handleChange}
            accept='video/*'
            withCredentials={true}
            multiple={false}
            maxCount={1}
          >
            <Button
              style={{ boxShadow: '0px 1px 3px 0px #292E3914' }}
              className='text-gray4 mt-2 h-[38px] rounded-[6px] border-none bg-white'
              icon={<UploadIcon />}
            >
              Browse files
            </Button>
          </Upload>
        </label>
      </div>
    </div>
  );
};
