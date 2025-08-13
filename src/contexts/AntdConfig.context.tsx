'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { ConfigProvider, theme, ThemeConfig } from 'antd';
import { colors } from '../../colorpalette';

type AntdConfigContextType = {
  mode: string;
};

const AntdConfigContext = createContext<AntdConfigContextType>({
  mode: 'dark',
});

type Props = { children: React.ReactNode };

export const AntdConfigProvider = (props: Props) => {
  useEffect(() => {
    // Add custom CSS to fix input prefix/suffix borders
    const style = document.createElement('style');
    style.textContent = `
      .ant-input-affix-wrapper .ant-input-prefix,
      .ant-input-affix-wrapper .ant-input-suffix {
        border: none !important;
        background: transparent !important;
      }
      .ant-input-affix-wrapper .ant-input {
        border: none !important;
        background: transparent !important;
      }
      .ant-input-affix-wrapper:focus,
      .ant-input-affix-wrapper:focus-within {
        border-color: ${colors.primary.DEFAULT} !important;
        box-shadow: 0 0 0 2px ${colors.primary.DEFAULT}20 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const darkTheme: ThemeConfig = {
    token: {
      colorPrimary: colors.primary.DEFAULT,
      colorBgContainer: colors.background.DEFAULT,
      colorBgBase: colors.background.DEFAULT,
      colorBgLayout: colors.background.dark[200],
      colorBorder: '#3a3a3a',
      colorBorderSecondary: '#2a2a2a',
      colorText: '#ffffff',
      colorTextSecondary: '#e0e0e0',
      colorTextTertiary: '#b0b0b0',
      colorTextQuaternary: '#8a8a8a',
      colorBgElevated: colors.background[100],
      colorFill: '#3a3a3a',
      colorFillSecondary: '#2a2a2a',
      colorFillTertiary: '#1a1a1a',
      colorFillQuaternary: '#0a0a0a',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      colorWhite: '#ffffff',
    },
    algorithm: [theme.darkAlgorithm],
    cssVar: true,
    components: {
      Button: {
        primaryColor: '#ffffff',
        colorPrimary: colors.primary.DEFAULT,
        colorPrimaryHover: colors.primary[400],
        colorPrimaryActive: colors.primary[600],
        colorPrimaryText: '#ffffff',
        colorText: '#ffffff',
        colorTextDisabled: '#666666',
        colorBgTextActive: colors.primary.DEFAULT + '20',
        colorBgTextHover: colors.primary.DEFAULT + '10',
      },
      Table: {
        headerBg: colors.background[100],
        headerColor: '#ffffff',
        bodySortBg: colors.background.dark[300],
        rowHoverBg: colors.background[200],
        borderColor: '#3a3a3a',
        colorText: '#ffffff',
        colorTextHeading: '#ffffff',
      },
      Input: {
        colorBgContainer: colors.background[100],
        colorBorder: '#3a3a3a',
        colorText: '#ffffff',
        colorTextPlaceholder: '#8a8a8a',
        activeBorderColor: colors.primary.DEFAULT,
        hoverBorderColor: '#4a4a4a',
        addonBg: colors.background[100],
        colorIcon: '#ffffff',
        colorIconHover: '#ffffff',
      },
      Select: {
        colorBgContainer: colors.background[100],
        colorBorder: '#3a3a3a',
        colorText: '#ffffff',
        colorTextPlaceholder: '#8a8a8a',
        optionSelectedBg: colors.primary.DEFAULT + '20',
        optionActiveBg: colors.background[200],
      },
      Modal: {
        contentBg: colors.background.DEFAULT,
        headerBg: colors.background.DEFAULT,
        titleColor: '#ffffff',
        colorText: '#ffffff',
      },
      Drawer: {
        colorBgElevated: colors.background.DEFAULT,
        colorText: '#ffffff',
      },
      Menu: {
        itemBg: 'transparent',
        subMenuItemBg: colors.background[100],
        itemSelectedBg: colors.primary.DEFAULT + '20',
        itemHoverBg: colors.background[200],
        itemSelectedColor: colors.primary.DEFAULT,
        itemColor: '#ffffff',
        colorText: '#ffffff',
      },
      Form: {
        labelColor: '#ffffff',
      },
      Typography: {
        colorText: '#ffffff',
        colorTextHeading: '#ffffff',
        colorTextDescription: '#e0e0e0',
      },
      Card: {
        colorBgContainer: colors.background[100],
        colorBorderSecondary: '#3a3a3a',
        colorText: '#ffffff',
        colorTextHeading: '#ffffff',
      },
      Pagination: {
        colorBgContainer: colors.background[100],
        colorText: '#ffffff',
        colorPrimary: colors.primary.DEFAULT,
        itemActiveBg: colors.primary.DEFAULT,
        itemActiveColorDisabled: '#ffffff',
      },
      Popconfirm: {
        colorText: '#ffffff',
        colorBgElevated: colors.background[100],
      },
      Tooltip: {
        colorText: '#ffffff',
        colorBgSpotlight: colors.background[600],
      },
    },
  };

  return (
    <AntdConfigContext.Provider value={{ mode: 'dark' }}>
      <ConfigProvider theme={darkTheme}>{props.children}</ConfigProvider>
    </AntdConfigContext.Provider>
  );
};

export function useAntdConfig() {
  const context = useContext(AntdConfigContext);
  if (!context) {
    throw new Error('useAntdConfig must be used within an AntdConfigProvider');
  }
  return context;
}
