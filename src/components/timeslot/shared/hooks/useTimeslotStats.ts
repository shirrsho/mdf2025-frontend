import { useMemo } from 'react';
import { ITimeslot } from '@/interfaces';
import { useTimeslotUtils, TimeSlot } from './useTimeslotUtils';

interface TimeslotStatsProps {
  timeslots: ITimeslot[];
  webinars?: any[];
  timeSlots?: TimeSlot[];
}

export const useTimeslotStats = ({
  timeslots,
  webinars = [],
  timeSlots,
}: TimeslotStatsProps) => {
  const { createAllTimeSlots } = useTimeslotUtils();

  const stats = useMemo(() => {
    const slots = timeSlots || createAllTimeSlots(timeslots, webinars);

    const totalTimeslots = timeslots.length;
    const totalSlots = slots.length;
    const bookedSlots = slots.filter((slot) => slot.isOccupied).length;
    const availableSlots = totalSlots - bookedSlots;
    const totalWebinars = webinars.length;

    // Create webinar count map
    const timeslotWebinarMap: Record<string, number> = {};
    webinars.forEach((webinar) => {
      const timeslotId = webinar.timeslotId || webinar.timeslot?.id;
      if (timeslotId) {
        timeslotWebinarMap[timeslotId] =
          (timeslotWebinarMap[timeslotId] || 0) + 1;
      }
    });

    // Count past and upcoming timeslots
    const now = new Date();
    const pastTimeslots = timeslots.filter(
      (t) => new Date(t.endTime) < now
    ).length;
    const upcomingTimeslots = timeslots.filter(
      (t) => new Date(t.startTime) > now
    ).length;

    const utilizationRate =
      totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

    return {
      totalTimeslots,
      totalSlots,
      bookedSlots,
      availableSlots,
      totalWebinars,
      pastTimeslots,
      upcomingTimeslots,
      utilizationRate,
      timeslotWebinarMap,
    };
  }, [timeslots, webinars, timeSlots, createAllTimeSlots]);

  return stats;
};
