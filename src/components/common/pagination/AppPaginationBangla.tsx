import React from 'react';

interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const AppPaginationBangla: React.FC<AppPaginationProps> = ({
  currentPage,
  totalPages,
  limit,
  totalItems,
  onPageChange,
  onLimitChange,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const limitOptions = [12, 24, 36, 48];

  return (
    <nav className='mt-8 flex flex-col items-center space-y-4'>
      <div className='flex items-center space-x-4'>
        <span className='text-gray-700'>প্রতি পৃষ্ঠায় দেখান:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className='rounded border px-2 py-1'
        >
          {limitOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <ul className='flex space-x-2'>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`rounded px-3 py-1 ${
                currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
      <div className='text-gray-700'>
        মোট {totalItems} জন অবদানকারী মধ্যে {(currentPage - 1) * limit + 1} থেকে{' '}
        {Math.min(currentPage * limit, totalItems)} পর্যন্ত দেখানো হচ্ছে
      </div>
    </nav>
  );
};
