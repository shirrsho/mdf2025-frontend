import { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#F4612E',
    colorInfo: '#F4612E',
    colorSuccess: '#52c41a',
    colorPrimaryBg: '#F4612E21',
    colorBgContainer: '#232323',
    colorBgBase: '#232323',
    colorBgLayout: '#1a1a1a',
    colorBorder: '#3a3a3a',
    colorText: '#ffffff',
    colorTextSecondary: '#e0e0e0',
    colorBgElevated: '#2a2a2a',
  },
  components: {
    Button: {
      defaultActiveBorderColor: '#F4612E',
      defaultActiveBg: '#F4612E',
      defaultActiveColor: '#ffffff',
      primaryColor: '#F4612E',
    },
    Table: {
      headerSplitColor: '#3a3a3a',
      headerBg: '#2a2a2a',
      bodySortBg: '#262626',
    },
    Input: {
      colorBgContainer: '#2a2a2a',
      colorBorder: '#3a3a3a',
      colorText: '#ffffff',
    },
    Select: {
      colorBgContainer: '#2a2a2a',
      colorBorder: '#3a3a3a',
      colorText: '#ffffff',
    },
    Modal: {
      contentBg: '#232323',
      headerBg: '#232323',
    },
  },
};
