import { ChartBarIcon, Grid } from 'lucide-react';
import React from 'react';

interface ViewModeToggleProps {
  activeMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  activeMode,
  onViewModeChange,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: {
      button: 'p-1',
      icon: 'h-4 w-4',
    },
    md: {
      button: 'p-2',
      icon: 'h-5 w-5',
    },
    lg: {
      button: 'p-3',
      icon: 'h-6 w-6',
    },
    xl: {
      button: 'p-4',
      icon: 'h-7 w-7',
    },
  };

  return (
    <div className='flex rounded-lg bg-background dark:bg-background-dark'>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`rounded-l-lg transition-colors ${sizeClasses[size].button} ${
          activeMode === 'grid'
            ? 'bg-primary text-white dark:bg-primary-dark'
            : 'text-paragraph hover:bg-primary-300 dark:text-paragraph-dark dark:hover:bg-primary-dark-300'
        }`}
      >
        <Grid className={sizeClasses[size].icon} />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`rounded-r-lg transition-colors ${sizeClasses[size].button} ${
          activeMode === 'list'
            ? 'bg-primary text-white dark:bg-primary-dark'
            : 'text-paragraph hover:bg-primary-300 dark:text-paragraph-dark dark:hover:bg-primary-dark-300'
        }`}
      >
        <ChartBarIcon className={sizeClasses[size].icon} />
      </button>
    </div>
  );
};
