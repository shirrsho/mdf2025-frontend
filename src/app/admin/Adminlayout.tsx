'use client';
import React from 'react';
import { Drawer, Layout } from 'antd';
import { X } from 'lucide-react';
import { useAdminLayoutContext } from '@/contexts';
import { AdminMenu, AdminNavbar } from '@/components/layout';

const { Sider } = Layout;

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { collapsed, drawer, setDrawer } = useAdminLayoutContext();

  return (
    <div className='relative'>
      <Sider
        style={{
          position: 'fixed',
          minHeight: '100vh',
          minWidth: '350px',
          maxWidth: '350px',
          overflowX: 'hidden',
          overflowY: 'auto',
          width: collapsed ? 0 : 220,
          height: '100vh',
          transition: 'width 0.5s ease-in-out',
        }}
        className='!hidden overflow-y-auto border-r border-gray-200 bg-background-100 dark:border-gray-700 dark:bg-background-dark-100 md:!block'
        trigger={null}
        collapsedWidth={0}
        collapsible
        collapsed={collapsed}
      >
        <AdminMenu />
      </Sider>
      <Drawer
        placement='left'
        closeIcon={<X className='text-white' />}
        closable={true}
        onClose={() => setDrawer(false)}
        open={drawer}
        width={250}
        className='!bg-background-100 dark:!bg-background-dark-100'
      >
        <AdminMenu />
      </Drawer>
      <div
        className={`ml-[0px] ${
          collapsed ? 'md:ml-[0px]' : 'md:ml-[200px]'
        } relative transition-[margin-left] duration-500 ease-in-out`}
      >
        <AdminNavbar />
        <div className='min-h-screen w-full rounded-tl-[10px] p-4 md:p-6'>
          {children}
        </div>
      </div>
    </div>
  );
};
