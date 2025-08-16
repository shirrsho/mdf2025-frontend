import dayjs from 'dayjs';
import { IWebinar } from '@/interfaces';

// Display status enum for frontend (calculated from timeslot data)
export enum WebinarDisplayStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface WebinarDisplayStatusResult {
  status: WebinarDisplayStatus;
  label: string;
  color: string;
  bgColor: string;
}

/**
 * Calculate the display status of a webinar based on its timeslot and current time
 */
export const getWebinarDisplayStatus = (
  webinar: IWebinar
): WebinarDisplayStatusResult => {
  // If webinar is cancelled, always show cancelled
  if (webinar.status === 'cancelled') {
    return {
      status: WebinarDisplayStatus.CANCELLED,
      label: 'Cancelled',
      color: '#ef4444',
      bgColor: '#fef2f2',
    };
  }

  // Get the timeslot times
  const timeslotStartTime = webinar.scheduledStartTime;

  if (!timeslotStartTime) {
    // If no timeslot data, assume scheduled
    return {
      status: WebinarDisplayStatus.SCHEDULED,
      label: 'Scheduled',
      color: '#3b82f6',
      bgColor: '#eff6ff',
    };
  }

  const now = dayjs();
  const startTime = dayjs(timeslotStartTime);

  // Calculate end time based on webinar duration or timeslot end time
  let endTime: dayjs.Dayjs;
  if (webinar.duration) {
    endTime = startTime.add(webinar.duration, 'minute');
  } else if (webinar.timeslot?.endTime) {
    endTime = dayjs(webinar.timeslot.endTime);
  } else {
    // Default to 1 hour if no duration or end time
    endTime = startTime.add(60, 'minute');
  }

  // Determine status based on current time
  if (now.isBefore(startTime)) {
    return {
      status: WebinarDisplayStatus.SCHEDULED,
      label: 'Scheduled',
      color: '#3b82f6',
      bgColor: '#eff6ff',
    };
  } else if (now.isAfter(endTime)) {
    return {
      status: WebinarDisplayStatus.COMPLETED,
      label: 'Completed',
      color: '#10b981',
      bgColor: '#f0fdf4',
    };
  } else {
    return {
      status: WebinarDisplayStatus.LIVE,
      label: 'Live',
      color: '#f59e0b',
      bgColor: '#fffbeb',
    };
  }
};

/**
 * Get status badge component props for Ant Design Tag
 */
export const getWebinarStatusTagProps = (webinar: IWebinar) => {
  const statusData = getWebinarDisplayStatus(webinar);

  return {
    color: statusData.color,
    style: {
      backgroundColor: statusData.bgColor,
      color: statusData.color,
      border: `1px solid ${statusData.color}30`,
      borderRadius: '6px',
      fontWeight: '500',
    },
    children: statusData.label,
  };
};

/**
 * Format webinar time display
 */
export const formatWebinarTime = (webinar: IWebinar): string => {
  const startTime = webinar?.scheduledStartTime;

  if (!startTime) {
    return 'Time TBD';
  }

  const start = dayjs(startTime);

  if (webinar.duration) {
    const end = start.add(webinar.duration, 'minute');
    return `${start.format('MMM DD, YYYY - h:mm A')} - ${end.format('h:mm A')}`;
  } else if (webinar.timeslot?.endTime) {
    const end = dayjs(webinar.timeslot.endTime);
    return `${start.format('MMM DD, YYYY - h:mm A')} - ${end.format('h:mm A')}`;
  } else {
    return start.format('MMM DD, YYYY - h:mm A');
  }
};

/**
 * Check if webinar is happening now
 */
export const isWebinarLive = (webinar: IWebinar): boolean => {
  const status = getWebinarDisplayStatus(webinar);
  return status.status === WebinarDisplayStatus.LIVE;
};

/**
 * Check if webinar is in the past
 */
export const isWebinarCompleted = (webinar: IWebinar): boolean => {
  const status = getWebinarDisplayStatus(webinar);
  return status.status === WebinarDisplayStatus.COMPLETED;
};

/**
 * Check if webinar is in the future
 */
export const isWebinarScheduled = (webinar: IWebinar): boolean => {
  const status = getWebinarDisplayStatus(webinar);
  return status.status === WebinarDisplayStatus.SCHEDULED;
};

export const getWebinarDurationText = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  }
  return `${mins}m`;
};
