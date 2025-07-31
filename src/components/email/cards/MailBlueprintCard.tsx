import React from 'react';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { IMailBlueprint } from '@/interfaces';
import { ActionButton, HtmlRenderer } from '@/components/common';

interface MailBlueprintCardProps {
  blueprint: IMailBlueprint;
  onEdit: () => void;
  onDelete: () => void;
}
export const MailBlueprintCard: React.FC<MailBlueprintCardProps> = ({
  blueprint,
  onEdit,
  onDelete,
}) => {
  return (
    <div className='border border-primary-100 p-2'>
      <div className='mb-3 flex items-start justify-between'>
        <h3 className='line-clamp-1 text-lg font-semibold text-heading dark:text-heading-dark'>
          {blueprint.name}
        </h3>
      </div>
      <div className='mb-3 line-clamp-3 text-sm text-textColor dark:text-textColor-dark'>
        {blueprint.resourceName}
      </div>
      <div className='mb-4 overflow-hidden text-paragraph dark:text-paragraph-dark'>
        <HtmlRenderer htmlString={blueprint.bodyContent} />
      </div>
      <div className='flex items-center justify-between gap-2 text-sm text-textColor dark:text-textColor-dark'>
        <div className='flex gap-2'>
          <CalendarIcon className='h-4 w-4' />
          <span className=''>
            {dayjs(blueprint.createdAt).format('DD MMM, YYYY')}
          </span>
        </div>
        <div className='flex gap-2'>
          <ActionButton.Edit onClick={onEdit} />
          {blueprint.resourceName ? (
            <></>
          ) : (
            <ActionButton.Delete onClick={onDelete} size='small' />
          )}
        </div>
      </div>
    </div>
  );
};
