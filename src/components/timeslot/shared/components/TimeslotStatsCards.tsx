import React from 'react';
import { Card, Row, Col } from 'antd';
import { Clock, Users, Grid, Calendar as CalendarIcon } from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface TimeslotStatsCardsProps {
  stats: {
    totalTimeslots?: number;
    totalSlots?: number;
    bookedSlots?: number;
    availableSlots?: number;
    totalWebinars?: number;
    pastTimeslots?: number;
    upcomingTimeslots?: number;
    utilizationRate?: number;
  };
  variant?: 'default' | 'overview' | 'detail';
}

export const TimeslotStatsCards: React.FC<TimeslotStatsCardsProps> = ({
  stats,
  variant = 'default',
}) => {
  const getStatsConfig = (): StatCard[] => {
    switch (variant) {
      case 'overview':
        return [
          {
            title: 'Total Slots',
            value: stats.totalSlots || 0,
            icon: <Grid className='h-5 w-5' />,
            color: '#3b82f6',
            bgColor: '#3b82f620',
          },
          {
            title: 'Available',
            value: stats.availableSlots || 0,
            icon: <Clock className='h-5 w-5' />,
            color: '#10b981',
            bgColor: '#10b98120',
          },
          {
            title: 'Booked',
            value: stats.bookedSlots || 0,
            icon: <Users className='h-5 w-5' />,
            color: '#ef4444',
            bgColor: '#ef444420',
          },
          {
            title: 'Utilization',
            value: stats.utilizationRate || 0,
            icon: <Grid className='h-5 w-5' />,
            color: '#8b5cf6',
            bgColor: '#8b5cf620',
          },
        ];
      case 'detail':
        return [
          {
            title: 'Scheduled Webinars',
            value: stats.totalWebinars || 0,
            icon: <Users className='h-5 w-5' />,
            color: '#10b981',
            bgColor: '#10b98120',
          },
          {
            title: 'Available Slots',
            value: stats.availableSlots || 0,
            icon: <Clock className='h-5 w-5' />,
            color: '#f59e0b',
            bgColor: '#f59e0b20',
          },
          {
            title: 'Capacity Used',
            value: stats.utilizationRate || 0,
            icon: <Grid className='h-5 w-5' />,
            color: '#6366f1',
            bgColor: '#6366f120',
          },
        ];
      default:
        return [
          {
            title: 'Total Timeslots',
            value: stats.totalTimeslots || 0,
            icon: <Clock className='h-6 w-6' />,
            color: '#F4612E',
            bgColor: '#F4612E20',
          },
          {
            title: 'Total Webinars',
            value: stats.totalWebinars || 0,
            icon: <Users className='h-6 w-6' />,
            color: '#10b981',
            bgColor: '#10b98120',
          },
          {
            title: 'Past Timeslots',
            value: stats.pastTimeslots || 0,
            icon: <Grid className='h-6 w-6' />,
            color: '#f59e0b',
            bgColor: '#f59e0b20',
          },
          {
            title: 'Upcoming',
            value: stats.upcomingTimeslots || 0,
            icon: <CalendarIcon className='h-6 w-6' />,
            color: '#bfab25',
            bgColor: '#bfab2520',
          },
        ];
    }
  };

  const statsConfig = getStatsConfig();
  const cardSize = variant === 'overview' ? 6 : variant === 'detail' ? 8 : 6;

  return (
    <Row gutter={[16, 16]} className='mb-8'>
      {statsConfig.map((stat, index) => (
        <Col xs={24} sm={12} lg={cardSize} key={index}>
          <Card
            className='border-0 shadow-sm transition-all duration-200 hover:shadow-md'
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              border: `1px solid ${stat.color}30`,
            }}
          >
            <div className='flex items-center'>
              <div
                className={`mr-4 flex items-center justify-center rounded-lg ${
                  variant === 'overview' ? 'h-10 w-10' : 'h-12 w-12'
                }`}
                style={{ backgroundColor: stat.bgColor }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <div>
                <p
                  className={`font-medium ${
                    variant === 'overview' ? 'text-xs' : 'text-sm'
                  }`}
                  style={{
                    color: stat.color.replace('20', '70'),
                  }}
                >
                  {stat.title}
                </p>
                <p
                  className={`font-bold ${
                    variant === 'overview' ? 'text-xl' : 'text-2xl'
                  }`}
                  style={{
                    color: '#F9FAFB',
                  }}
                >
                  {stat.value}
                  {stat.title.includes('Utilization') ||
                  stat.title.includes('Used')
                    ? '%'
                    : ''}
                </p>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
