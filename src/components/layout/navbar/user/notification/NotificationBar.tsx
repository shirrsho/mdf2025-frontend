'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Dropdown, Tabs } from 'antd';
import {
  useGetAllNotifications,
  useGetNotificationCount,
  useIsLoggedInQuery,
  useUpdateNotification,
} from '@/apis';
import { useSocket } from '@/contexts';
import { INotification } from '@/interfaces';
import { NotificationButton } from './NotificationButton';
import dayjs from 'dayjs';

export const NotificationBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { data: isLoggedIn } = useIsLoggedInQuery();
  const { data, refetch } = useGetAllNotifications({
    query: {
      limit: 5,
    },
  });
  const { data: count, refetch: refetchCount } = useGetNotificationCount();
  const updateNotification = useUpdateNotification();

  const updateNotificationById = async (id: number) => {
    await updateNotification.mutateAsync({ id });
    await refetch();
    await refetchCount();
  };

  const { socket } = useSocket();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const asyncRefetch = async () => {
      await refetch();
    };
    asyncRefetch();
  }, [pathname, refetch]);

  useEffect(() => {
    if (socket) {
      socket.on('message', async (message: string) => {
        console.log('Received message:', message);
        await refetch();
        if (audioRef.current) {
          audioRef.current.play();
        }
      });

      return () => {
        socket.off('message');
      };
    }
  }, [socket, refetch]);

  const renderNotifications = (filter: string) => {
    if (!data || data.count === 0) {
      return (
        <div className='flex min-h-[200px] flex-col items-center justify-center'>
          No notifications
        </div>
      );
    }

    return data?.data
      ?.filter(
        (notification: INotification) =>
          filter === 'all' ||
          (filter === 'unread' && !notification.isRead) ||
          (filter === 'read' && notification.isRead)
      )
      .map((notification: INotification) => (
        <Fragment key={notification.id}>
          <div
            className={`${
              !notification.isRead
                ? 'bg-background-500 dark:to-background-dark-500'
                : 'bg-background-100 dark:bg-background-dark-100'
            } mb-2 flex items-center justify-between rounded-md px-1 py-2`}
            onClick={() => updateNotificationById(notification.id)}
          >
            <Link href={`${notification.url}`}>
              <div className='flex items-center'>
                <div className='flex items-center'>
                  <Image
                    src='/logo.png'
                    alt='logo image'
                    height={35}
                    width={130}
                    className='mr-6 h-10 w-10 rounded-full bg-primary-500 object-cover'
                  />
                  <div>
                    <p className='font-semibold'>{notification.message}</p>
                    <p className='text-sm'>
                      {dayjs(notification.createdAt).format(
                        'MMM D, YYYY h:mm A'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Fragment>
      ));
  };

  const tabItems = [
    {
      key: 'all',
      label: 'All',
      children: renderNotifications('all'),
    },
    {
      key: 'unread',
      label: 'Unread',
      children: renderNotifications('unread'),
    },
    {
      key: 'read',
      label: 'Read',
      children: renderNotifications('read'),
    },
  ];

  const menu = (
    <div className='max-h-[320px] min-h-[320px] w-80 divide-y divide-gray-100 overflow-y-auto rounded-md bg-background px-5 py-3 shadow-lg ring-1 dark:bg-background-dark'>
      <Tabs defaultActiveKey='all' items={tabItems} />
      <div className='absolute bottom-2 mt-4 w-[280px]'>
        <Link href='/notifications'>
          <Button block type='primary'>
            See all...
          </Button>
        </Link>
      </div>
    </div>
  );

  if (!isLoggedIn) return null;

  return (
    <div className='text-right'>
      <audio ref={audioRef} src='/notification.mp3' />
      <Dropdown
        open={menuOpen}
        dropdownRender={() => menu}
        trigger={['click']}
        onOpenChange={(visible) => setMenuOpen(visible)}
      >
        <NotificationButton count={count} />
      </Dropdown>
    </div>
  );
};
