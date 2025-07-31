import React from 'react';
interface IBreadCumbHeadingProps {
  title: string;
}
export const BreadCumbHeading: React.FC<IBreadCumbHeadingProps> = ({
  title,
}) => {
  return (
    <div className='bg-primary py-6 dark:bg-primary-dark md:py-12'>
      <h1 className='mx-auto w-full max-w-7xl px-3 text-2xl font-bold text-heading-dark md:text-4xl'>
        {title}
      </h1>
    </div>
  );
};
