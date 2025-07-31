'use client';
import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { Paperclip } from 'lucide-react';

interface FileUploaderProps {
  name: string;
  onChange?: (file: File) => void;
  value?: string;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  name,
  onChange,
  value,
  accept,
}) => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange && onChange(file);
    }
  };

  return (
    <div className='h-48 overflow-hidden rounded-md border-2 border-dashed border-primary'>
      <div className='flex h-full w-full flex-col items-center justify-center gap-[10px] bg-background dark:bg-background-dark'>
        <div className='font-Inter text-gray4 text-[14px] font-semibold'>
          Upload File
        </div>
        <div className='font-Inter text-gray3 text-center text-[12px] font-medium'>
          Supported files are: {accept || '.pdf'}
        </div>
        <label htmlFor={`file-upload-${name}`}>
          <Button
            style={{ boxShadow: '0px 1px 3px 0px #292E3914' }}
            className='text-gray4 mt-2 h-[38px] rounded-[6px] border-none'
            icon={<Paperclip />}
            onClick={() =>
              document.getElementById(`file-upload$-${name}`)?.click()
            }
          >
            Browse files
          </Button>
          <input
            id={`file-upload$-${name}`}
            type='file'
            name={name}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept={accept || 'application/pdf'}
          />
        </label>
        {fileName && (
          <div className='mx-auto line-clamp-1'>
            <Tooltip title={fileName}>{fileName}</Tooltip>
          </div>
        )}
        {!fileName && value && (
          <div className='mx-auto line-clamp-1'>
            <Tooltip title={value.slice(46)}> {value.slice(46)}</Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
