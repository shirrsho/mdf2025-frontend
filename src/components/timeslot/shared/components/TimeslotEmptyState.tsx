import React from 'react';
import { Card, Button, Typography } from 'antd';
import { CalendarDays, Plus, LucideIcon } from 'lucide-react';

const { Title, Text } = Typography;

interface TimeslotEmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const TimeslotEmptyState: React.FC<TimeslotEmptyStateProps> = ({
  title = 'No Time Slots Available',
  message = 'Create some timeslots to see their time slots here.',
  actionLabel = 'Create Your First Timeslot',
  onAction,
  icon: Icon = CalendarDays,
}) => {
  return (
    <Card className='bg-gray-800 py-16 text-center shadow-sm'>
      <Icon className='mx-auto mb-4 h-16 w-16 text-gray-400' />
      <Title level={4} className='mb-2 text-white'>
        {title}
      </Title>
      <Text className='mb-6 text-gray-300'>{message}</Text>
      {onAction && (
        <Button
          type='primary'
          size='large'
          icon={<Plus className='h-4 w-4' />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
