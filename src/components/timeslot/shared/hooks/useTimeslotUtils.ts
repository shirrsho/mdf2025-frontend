import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ITimeslot } from '@/interfaces';

dayjs.extend(isBetween);

export interface TimeSlot {
  id: string;
  timeslotId: string;
  timeslotName: string;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  isOccupied: boolean;
  webinar?: any;
  isGrouped: boolean;
  originalTimeslot: ITimeslot;
}

export const useTimeslotUtils = () => {
  const formatTime = (date: string | Date | dayjs.Dayjs) => {
    return dayjs(date).format('hh:mm A');
  };

  const formatDate = (date: string | Date | dayjs.Dayjs) => {
    return dayjs(date).format('MMMM DD, YYYY');
  };

  const formatFullDateTime = (date: string | Date | dayjs.Dayjs) => {
    return dayjs(date).format('MMM DD, YYYY - hh:mm A');
  };

  const formatDateKey = (dateKey: string) => {
    return dayjs(dateKey).format('MMMM DD, YYYY - dddd');
  };

  const formatDuration = (
    startTime: string | Date | dayjs.Dayjs,
    endTime: string | Date | dayjs.Dayjs
  ) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const duration = end.diff(start, 'minutes');
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getTimeslotStatus = (timeslot: ITimeslot) => {
    const now = dayjs();
    const start = dayjs(timeslot.startTime);
    const end = dayjs(timeslot.endTime);

    const isActive = now.isBetween(start, end);
    const isUpcoming = start.isAfter(now);

    if (isActive) {
      return {
        status: 'Live Now',
        color: '#10b981',
        bgColor: '#10b98120',
        description: 'This timeslot is currently active',
      };
    } else if (isUpcoming) {
      return {
        status: 'Upcoming',
        color: '#f59e0b',
        bgColor: '#f59e0b20',
        description: 'Scheduled for the future',
      };
    } else {
      return {
        status: 'Completed',
        color: '#6b7280',
        bgColor: '#6b728020',
        description: 'This timeslot has ended',
      };
    }
  };

  const getDateStatus = (dateKey: string) => {
    const date = dayjs(dateKey);
    const today = dayjs();

    if (date.isSame(today, 'day')) {
      return { label: 'Today', color: '#10b981', bgColor: '#10b98120' };
    } else if (date.isAfter(today)) {
      return { label: 'Upcoming', color: '#f59e0b', bgColor: '#f59e0b20' };
    } else {
      return { label: 'Past', color: '#ef4444', bgColor: '#ef444420' };
    }
  };

  const createTimeSlots = (
    timeslot: ITimeslot,
    webinars: any[] = []
  ): TimeSlot[] => {
    if (!timeslot) return [];

    const start = dayjs(timeslot.startTime);
    const end = dayjs(timeslot.endTime);
    const duration = end.diff(start, 'minutes');
    const slotDuration = 30; // 30 minute slots
    const totalSlots = Math.ceil(duration / slotDuration);

    const slots: TimeSlot[] = [];
    const processedWebinars = new Set();

    // Get webinars for this specific timeslot
    const timeslotWebinars = webinars.filter(
      (webinar) =>
        webinar.timeslotId === timeslot.id ||
        webinar.timeslot?.id === timeslot.id
    );

    for (let i = 0; i < totalSlots; i++) {
      const slotStart = start.add(i * slotDuration, 'minutes');
      const slotEnd = start.add((i + 1) * slotDuration, 'minutes');

      // Check if this slot is occupied by a webinar
      const occupyingWebinar = timeslotWebinars.find((webinar) => {
        const webinarStart = dayjs(
          webinar.scheduledStartTime || timeslot.startTime
        );
        const webinarEnd = webinarStart.add(webinar.duration, 'minutes');
        return slotStart.isBefore(webinarEnd) && slotEnd.isAfter(webinarStart);
      });

      if (occupyingWebinar && !processedWebinars.has(occupyingWebinar.id)) {
        // This is a new webinar, create a grouped slot for it
        const webinarStart = dayjs(
          occupyingWebinar.scheduledStartTime || timeslot.startTime
        );
        const webinarEnd = webinarStart.add(
          occupyingWebinar.duration,
          'minutes'
        );

        slots.push({
          id: `${timeslot.id}-webinar-${occupyingWebinar.id}`,
          timeslotId: timeslot.id!,
          timeslotName: timeslot.timeslotName,
          startTime: webinarStart,
          endTime: webinarEnd,
          isOccupied: true,
          webinar: occupyingWebinar,
          isGrouped: true,
          originalTimeslot: timeslot,
        });

        processedWebinars.add(occupyingWebinar.id);

        // Skip ahead to after this webinar
        const webinarDurationSlots = Math.ceil(
          occupyingWebinar.duration / slotDuration
        );
        i += webinarDurationSlots - 1;
      } else if (!occupyingWebinar) {
        // This is an available slot
        slots.push({
          id: `${timeslot.id}-slot-${i}`,
          timeslotId: timeslot.id!,
          timeslotName: timeslot.timeslotName,
          startTime: slotStart,
          endTime: slotEnd,
          isOccupied: false,
          webinar: null,
          isGrouped: false,
          originalTimeslot: timeslot,
        });
      }
    }

    return slots;
  };

  const createAllTimeSlots = (
    timeslots: ITimeslot[],
    webinars: any[] = []
  ): TimeSlot[] => {
    if (!timeslots.length) return [];

    const allSlots: TimeSlot[] = [];

    timeslots.forEach((timeslot) => {
      const timeslotSlots = createTimeSlots(timeslot, webinars);
      allSlots.push(...timeslotSlots);
    });

    // Sort slots by start time
    return allSlots.sort(
      (a, b) => a.startTime.valueOf() - b.startTime.valueOf()
    );
  };

  const groupSlotsByDate = (slots: TimeSlot[]): Record<string, TimeSlot[]> => {
    const grouped: Record<string, TimeSlot[]> = {};

    slots.forEach((slot) => {
      const dateKey = slot.startTime.format('YYYY-MM-DD');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });

    return grouped;
  };

  return {
    formatTime,
    formatDate,
    formatFullDateTime,
    formatDateKey,
    formatDuration,
    getTimeslotStatus,
    getDateStatus,
    createTimeSlots,
    createAllTimeSlots,
    groupSlotsByDate,
  };
};
