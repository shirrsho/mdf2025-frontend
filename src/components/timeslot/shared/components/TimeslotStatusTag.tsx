import React from 'react';
import { Tag } from 'antd';
import { Clock, Zap, CheckCircle } from 'lucide-react';

interface StatusInfo {
  status: string;
  color: string;
  bgColor: string;
  description: string;
}

interface TimeslotStatusTagProps {
  statusInfo: StatusInfo;
  showIcon?: boolean;
  size?: 'small' | 'default';
}

export const TimeslotStatusTag: React.FC<TimeslotStatusTagProps> = ({
  statusInfo,
  showIcon = true,
  size = 'default',
}) => {
  const getIcon = () => {
    if (!showIcon) return null;

    switch (statusInfo.status) {
      case 'Live Now':
        return <Zap className='h-4 w-4' style={{ color: statusInfo.color }} />;
      case 'Upcoming':
        return (
          <Clock className='h-4 w-4' style={{ color: statusInfo.color }} />
        );
      case 'Completed':
        return (
          <CheckCircle
            className='h-4 w-4'
            style={{ color: statusInfo.color }}
          />
        );
      case 'Today':
        return <Zap className='h-4 w-4' style={{ color: statusInfo.color }} />;
      case 'Past':
        return (
          <CheckCircle
            className='h-4 w-4'
            style={{ color: statusInfo.color }}
          />
        );
      default:
        return (
          <Clock className='h-4 w-4' style={{ color: statusInfo.color }} />
        );
    }
  };

  const padding = size === 'small' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'small' ? '11px' : '12px';

  return (
    <Tag
      style={{
        backgroundColor: statusInfo.bgColor,
        color: statusInfo.color,
        border: `1px solid ${statusInfo.color}30`,
        borderRadius: '20px',
        padding,
        fontSize,
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        gap: showIcon ? '4px' : '0',
      }}
    >
      {getIcon()}
      <span>{statusInfo.status}</span>
    </Tag>
  );
};
