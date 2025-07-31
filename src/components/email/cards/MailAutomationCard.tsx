import React from 'react';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { IMailAutomation } from '@/interfaces';
import { ActionButton } from '@/components/common';

interface MailAutomationCardProps {
  automation: IMailAutomation;
  onEdit: () => void;
  onDelete: () => void;
}
export const MailAutomationCard: React.FC<MailAutomationCardProps> = ({
  automation,
  onDelete,
}) => {
  return (
    <div className='rounded-lg border border-background-200 bg-background p-4 transition-all duration-200 hover:border-primary hover:shadow-sm dark:border-background-dark-200 dark:bg-background-dark-100 dark:hover:border-primary-dark'>
      <div className='mb-3 flex items-start justify-between'>
        <h3 className='line-clamp-1 text-lg font-semibold text-heading dark:text-heading-dark'>
          {automation.name}
        </h3>
      </div>

      <div className='mb-3 line-clamp-3 text-sm text-textColor dark:text-textColor-dark'>
        {automation.resourceName}
      </div>

      <div className='flex items-center justify-between gap-2 text-sm text-textColor dark:text-textColor-dark'>
        <div className='flex gap-2'>
          <CalendarIcon className='h-4 w-4' />
          <span className=''>
            {dayjs(automation.createdAt).format('DD MMM, YYYY')}
          </span>
        </div>
        <div className='flex gap-2'>
          <ActionButton.Delete onClick={onDelete} size='small' />
        </div>
      </div>
    </div>
  );
};
