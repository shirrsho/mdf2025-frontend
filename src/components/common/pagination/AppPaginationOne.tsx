import React from 'react';

interface AppPaginationProps {
  pageSize: number;
  pageNo: number;
  total: number;
  setPageNo: (page: number) => void;
  setPageSize?: (size: number) => void;
}

export const AppPaginationOne: React.FC<AppPaginationProps> = ({
  pageSize,
  pageNo,
  total,
  setPageNo,
  setPageSize,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNo < totalPages) {
      setPageNo(pageNo + 1);
    }
  };

  const renderPageSizeButtons = () => {
    const sizes = [10, 20, 50, 100];
    return sizes.map((size) => (
      <button
        key={size}
        onClick={() => setPageSize && setPageSize(size)}
        className={`flex h-6 w-6 items-center justify-center rounded-md px-2 text-[10px] transition-colors md:h-8 md:w-8 md:text-sm ${
          size === pageSize
            ? 'bg-primary text-white dark:bg-primary-600'
            : 'bg-gray-200 text-heading hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        {size}
      </button>
    ));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const showEllipsis = totalPages > 5;

    if (showEllipsis) {
      if (pageNo <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
      } else if (pageNo >= totalPages - 2) {
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push('...');
        pageNumbers.push(pageNo);
        pageNumbers.push('...');
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers.map((number, index) => (
      <button
        type='button'
        key={index}
        onClick={() => typeof number === 'number' && setPageNo(number)}
        className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] transition-colors md:h-8 md:w-8 md:text-sm ${
          number === pageNo
            ? 'bg-primary text-white dark:bg-primary-600'
            : 'bg-gray-200 text-heading hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        } ${typeof number !== 'number' ? 'cursor-default' : ''}`}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className='my-4 flex flex-col items-center justify-between space-y-4 sm:my-8 sm:flex-row sm:space-y-0'>
      {setPageSize && (
        <div className='flex items-center space-x-1'>
          <span className='text-xs text-heading dark:text-gray-300 sm:text-sm'>
            Page Size:
          </span>
          {renderPageSizeButtons()}
        </div>
      )}
      <div className='flex items-center space-x-1'>
        <button
          type='button'
          onClick={handlePrevPage}
          disabled={pageNo === 1}
          className='flex h-6 w-6 items-center justify-center rounded-md bg-background-200 text-heading transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background-dark-200 dark:text-heading-dark md:h-8 md:w-8'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 sm:h-5 sm:w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        {renderPageNumbers()}

        <button
          type='button'
          onClick={handleNextPage}
          disabled={pageNo === totalPages}
          className='flex h-6 w-6 items-center justify-center rounded-md bg-background-200 text-heading transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background-dark-200 dark:text-heading-dark md:h-8 md:w-8'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 sm:h-5 sm:w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
