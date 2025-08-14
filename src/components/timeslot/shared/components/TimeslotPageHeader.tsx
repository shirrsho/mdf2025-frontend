import React from 'react';
import { Button, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface TimeslotPageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  backLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export const TimeslotPageHeader: React.FC<TimeslotPageHeaderProps> = ({
  title,
  subtitle,
  backUrl,
  backLabel = 'Back',
  icon: Icon,
  iconColor = '#F4612E',
  actions,
  showBackButton = true,
  children,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className='mb-8'>
      {showBackButton && (
        <Button
          icon={<ArrowLeft className='h-4 w-4' />}
          onClick={handleBack}
          className='mb-6 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
        >
          {backLabel}
        </Button>
      )}

      <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex items-start space-x-6'>
          {/* Icon */}
          {Icon && (
            <div className='flex-shrink-0'>
              <div
                className='flex h-24 w-24 items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-sm'
                style={{
                  background: `linear-gradient(135deg, ${iconColor}, ${iconColor}CC)`,
                }}
              >
                <Icon className='h-12 w-12' />
              </div>
            </div>
          )}

          {/* Header Info */}
          <div className='flex-1'>
            {/* <Title level={3} className='text-white'>
              {title}
            </Title>
            {subtitle && (
              <Text className='mb-4 !text-lg text-gray-200'>{subtitle}</Text>
            )} */}
            <div className='mb-8 flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-heading dark:text-white'>
                  {title}
                </h1>
                <p className='mt-1 text-paragraph dark:text-gray-200'>
                  {subtitle}
                </p>
              </div>
            </div>
            {children}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className='flex-shrink-0'>
            <Space>{actions}</Space>
          </div>
        )}
      </div>
    </div>
  );
};
