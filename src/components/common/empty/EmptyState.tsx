import React from 'react';
import { Box } from 'lucide-react';

type Props = {
  message: string;
  description?: string;
  className?: string;
};

export const EmptyState: React.FC<Props> = ({
  message,
  description,
  className,
}) => {
  return (
    <div
      className={`${className} flex h-64 flex-col items-center justify-center`}
    >
      <Box
        size={48}
        className='mb-4 text-6xl text-paragraph dark:text-paragraph-dark'
      />
      <h3 className='mb-2 text-xl font-semibold text-heading dark:text-heading-dark'>
        {message}
      </h3>
      {description && (
        <p className='text-paragraph dark:text-paragraph-dark'>{description}</p>
      )}
    </div>
  );
};
