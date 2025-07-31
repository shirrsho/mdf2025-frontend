import React from 'react';
import { Badge, ButtonProps } from 'antd';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

type Props = ButtonProps & {
  count?: number;
};

export const NotificationButton: React.FC<Props> = ({
  disabled,
  count,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className='flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full bg-primary-500 transition-all duration-200 ease-in-out hover:bg-primary-600 md:h-[32px] md:w-[32px] lg:h-[40px] lg:w-[40px]'
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <Badge count={count} offset={[0, 0]} size='small'>
        <Bell className='text-heading-dark dark:text-heading md:text-lg lg:text-xl' />
      </Badge>
    </motion.div>
  );
};
