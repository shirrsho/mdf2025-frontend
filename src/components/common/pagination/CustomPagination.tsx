'use client';
import React from 'react';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd/es/pagination';

interface CustomPaginationProps extends Omit<PaginationProps, 'itemRender'> {
  itemType?: string; // e.g., 'jobs', 'webinars', 'users', etc.
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  current,
  pageSize,
  total,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal,
  pageSizeOptions = ['10', '20', '50', '100'],
  onChange,
  itemType = 'items',
  ...props
}) => {
  const defaultShowTotal = (total: number, range: [number, number]) =>
    `Showing ${range[0]}-${range[1]} of ${total} ${itemType}`;

  return (
    <>
      <div className='custom-pagination-wrapper'>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          showSizeChanger={showSizeChanger}
          showQuickJumper={showQuickJumper}
          showTotal={showTotal || defaultShowTotal}
          pageSizeOptions={pageSizeOptions}
          size='default'
          className='custom-pagination'
          showLessItems={false}
          responsive={true}
          onChange={onChange}
          itemRender={(page, type, originalElement) => {
            if (type === 'prev') {
              return (
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-background-200 text-gray-300 transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-md'>
                  <span className='text-sm'>‹</span>
                </div>
              );
            }
            if (type === 'next') {
              return (
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-background-200 text-gray-300 transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-md'>
                  <span className='text-sm'>›</span>
                </div>
              );
            }
            if (type === 'page') {
              return (
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
                    page === current
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-background-200 text-gray-300 hover:bg-background-300 hover:text-white'
                  }`}
                >
                  {page}
                </div>
              );
            }
            if (type === 'jump-prev' || type === 'jump-next') {
              return (
                <div className='flex h-8 w-8 items-center rounded-full bg-background-200 text-gray-400 transition-all duration-200 hover:bg-background-300'>
                  <span className='text-sm'>•••</span>
                </div>
              );
            }
            return originalElement;
          }}
          {...props}
        />
      </div>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .custom-pagination-wrapper {
          padding: 24px 0 8px 0;
        }

        .custom-pagination {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          background: transparent !important;
          flex-wrap: wrap !important;
          gap: 16px !important;
        }

        /* Left side container for total text and options */
        .custom-pagination .ant-pagination-total-text {
          color: #9ca3af !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          margin: 0 0 0 0 !important;
          order: 1 !important;
        }

        .custom-pagination .ant-pagination-options {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          order: 2 !important;
          margin-right: auto !important;
        }

        /* Right side: Page navigation buttons */
        .custom-pagination .ant-pagination-prev,
        .custom-pagination .ant-pagination-next,
        .custom-pagination .ant-pagination-item,
        .custom-pagination .ant-pagination-jump-prev,
        .custom-pagination .ant-pagination-jump-next {
          border: none !important;
          background: transparent !important;
          margin: 0 2px !important;
          order: 3 !important;
        }

        .custom-pagination .ant-pagination-options-size-changer {
          height: 36px !important;
        }

        .custom-pagination .ant-select-selector {
          background: #374151 !important;
          border: 1px solid #4b5563 !important;
          border-radius: 8px !important;
          color: #f9fafb !important;
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
        }

        .custom-pagination .ant-select-selector:hover {
          border-color: #f4612e !important;
          box-shadow: 0 0 0 2px rgba(244, 97, 46, 0.1) !important;
        }

        .custom-pagination .ant-select-arrow {
          color: #9ca3af !important;
        }

        .custom-pagination .ant-pagination-options-quick-jumper {
          color: #9ca3af !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }

        .custom-pagination .ant-pagination-options-quick-jumper input {
          background: #374151 !important;
          border: 1px solid #4b5563 !important;
          border-radius: 6px !important;
          color: #f9fafb !important;
          width: 50px !important;
          height: 32px !important;
          text-align: center !important;
        }

        .custom-pagination .ant-pagination-options-quick-jumper input:hover {
          border-color: #f4612e !important;
        }

        .custom-pagination .ant-pagination-options-quick-jumper input:focus {
          border-color: #f4612e !important;
          box-shadow: 0 0 0 2px rgba(244, 97, 46, 0.1) !important;
          outline: none !important;
        }

        .custom-pagination .ant-pagination-item-container {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        /* Hide default pagination elements as we're using custom itemRender */
        .custom-pagination .ant-pagination-prev,
        .custom-pagination .ant-pagination-next,
        .custom-pagination .ant-pagination-item,
        .custom-pagination .ant-pagination-jump-prev,
        .custom-pagination .ant-pagination-jump-next {
          border: none !important;
          background: transparent !important;
          margin: 0 2px !important;
        }

        .custom-pagination .ant-pagination-prev a,
        .custom-pagination .ant-pagination-next a,
        .custom-pagination .ant-pagination-item a,
        .custom-pagination .ant-pagination-jump-prev a,
        .custom-pagination .ant-pagination-jump-next a {
          display: none !important;
        }
      `}</style>
    </>
  );
};
