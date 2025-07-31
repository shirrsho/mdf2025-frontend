'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type AdminLayoutContextType = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  drawer: boolean;
  setDrawer: (value: boolean) => void;
  navHeader: string;
};

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  collapsed: false,
  toggleCollapsed: () => {},
  drawer: false,
  setDrawer: () => {},
  navHeader: '',
});

type Props = { children: React.ReactNode };

export function AdminLayoutContextProvider(props: Props) {
  const pathName = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [navHeader, setNavHeader] = useState('Welcome');

  useEffect(() => {
    if (pathName) {
      const activeMenu = pathName.split('/')?.[2]?.toLocaleUpperCase();
      setNavHeader(activeMenu);
    }
  }, [pathName]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AdminLayoutContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
        drawer,
        setDrawer,
        navHeader,
      }}
    >
      {props.children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayoutContext() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error(
      'Admin Layout context must be used within an Admin layout provider'
    );
  }
  return context;
}
