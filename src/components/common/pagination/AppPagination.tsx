'use client';
import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select } from 'antd';
import { DEFAULT_PAGE_SIZE } from '@/constants';

interface AppPaginationProps {
  total?: number;
}

export const AppPagination: React.FC<AppPaginationProps> = ({ total = 0 }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const limit = parseInt(searchParams.get('pagesize') || DEFAULT_PAGE_SIZE, 10);
  const pageNo = parseInt(searchParams.get('pageno') || '1', 10);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageSizeOptions = [10, 20, 30, 50];

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const swipeContainerRef = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const minSwipeDistance = 50;

  const updateSearchParams = (newLimit: number, newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('pagesize', newLimit.toString());
    params.set('pageno', newPage.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageno', newPage.toString());

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handleLimitChange = (newLimit: string) => {
    const currentFirstItem = (pageNo - 1) * limit + 1;
    const newLimitNumber = parseInt(newLimit, 10);
    const newPage = Math.max(1, Math.ceil(currentFirstItem / newLimitNumber));

    updateSearchParams(newLimitNumber, newPage);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && pageNo < totalPages) {
      handlePageChange(pageNo + 1);
    }

    if (isRightSwipe && pageNo > 1) {
      handlePageChange(pageNo - 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];

    const showPages = windowWidth < 640 ? 1 : 2;

    pageNumbers.push(1);

    const rangeStart = Math.max(2, pageNo - showPages);
    const rangeEnd = Math.min(totalPages - 1, pageNo + showPages);

    if (rangeStart > 2) {
      pageNumbers.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pageNumbers.push('...');
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePageChange(pageNo - 1);
      } else if (e.key === 'ArrowRight') {
        handlePageChange(pageNo + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line
  }, [pageNo, totalPages]);

  const pageNumbers = getPageNumbers();

  return (
    <div className='flex flex-col items-center justify-between gap-2 px-2 py-3 sm:flex-row sm:gap-4 sm:py-4'>
      <div className='order-1 mb-2 flex w-full items-center justify-center gap-4 sm:order-1 sm:mb-0 sm:w-auto'>
        <div className='whitespace-nowrap text-xs sm:text-sm'>
          Page <span className='font-medium'>{pageNo}</span> of{' '}
          <span className='font-medium'>{totalPages}</span>
        </div>

        <div className='flex items-center gap-2'>
          <label className='hidden text-xs sm:inline'>Per page:</label>
          <Select
            value={limit.toString()}
            onChange={handleLimitChange}
            size='small'
            style={{ minWidth: 50 }}
            options={pageSizeOptions.map((size) => ({
              value: size.toString(),
              label: size.toString(),
            }))}
          />
        </div>
      </div>

      <div
        className='order-2 flex w-full items-center justify-center gap-1 sm:order-2 sm:w-auto sm:justify-end'
        ref={swipeContainerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          type='button'
          onClick={() => handlePageChange(pageNo - 1)}
          disabled={pageNo <= 1}
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

        <div className='flex items-center space-x-1'>
          {pageNumbers.map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                type='button'
                onClick={() => handlePageChange(page)}
                className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] transition-colors md:h-8 md:w-8 md:text-sm ${
                  page === pageNo
                    ? 'bg-primary text-white dark:bg-primary-600'
                    : 'bg-gray-200 text-heading hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className='px-0.5 text-xs sm:px-1 sm:text-sm'>
                ...
              </span>
            )
          )}
        </div>

        <button
          type='button'
          onClick={() => handlePageChange(pageNo + 1)}
          disabled={pageNo >= totalPages}
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
