'use client';
import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { imageLoader } from '@/utils/imageLoader';

type ImageProps = {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
} & Omit<NextImageProps, 'src' | 'width' | 'height' | 'className' | 'alt'>;

export const AppImage: React.FC<ImageProps> = ({
  src,
  width = 50,
  height = 50,
  className,
  ...rest
}) => {
  return src ? (
    <NextImage
      loader={imageLoader}
      src={src}
      alt={decodeURIComponent(
        src.match(/[a-f0-9-]{32}-(.+)\.[^.]+$/i)?.[1] || ''
      )}
      height={height}
      width={width}
      className={className}
      {...rest}
    />
  ) : (
    <div className={className} />
  );
};
