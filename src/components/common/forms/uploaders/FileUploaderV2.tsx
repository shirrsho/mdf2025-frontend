'use client';
import React from 'react';
import { Button, Tooltip, Upload, UploadProps } from 'antd';
import { getAccessToken } from '@/utils';
import { Toast } from '@/libs/toast';
import { UploadIcon } from 'lucide-react';

interface FileUploaderProps {
  onChange?: (file: any) => void;
  value?: string;
  accept?: string;
}

export const FileUploaderV2: React.FC<FileUploaderProps> = ({
  onChange,
  accept,
  value,
}) => {
  const token = getAccessToken();
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
          Upload PDF
        </div>

        <Upload
          showUploadList={false}
          action={`${process.env.NEXT_PUBLIC_API_URI}/api/image/v2/upload`}
          onChange={handleChange}
          accept={accept || 'application/pdf'}
          withCredentials={true}
          headers={{
            Authorization: `Bearer ${token}`,
          }}
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
        {value && (
          <div className='mx-auto line-clamp-1'>
            <Tooltip title={value.slice(46)}> {value.slice(46)}</Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
