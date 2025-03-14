import App from '@/App';
import client from '@/apollo';
import { THEME_COLOR } from '@/constants';
import '@/styles/global.scss';
import { ApolloProvider } from '@apollo/client';
import 'animate.css';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import i18n from './translation/i18n';

dayjs.extend(updateLocale);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.updateLocale(i18n.language, {
  weekStart: 1,
});

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <ApolloProvider client={client}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: THEME_COLOR.colorPrimary,
            fontFamily: THEME_COLOR.fontFamily,
            colorWhite: THEME_COLOR.colorWhite,
            colorLink: THEME_COLOR.colorPrimary,
            colorText: THEME_COLOR.colorText,
            colorSplit: THEME_COLOR.colorSplit,
          },
          components: {
            Table: {
              rowHoverBg: THEME_COLOR.rowHoverBg,
            },
            Select: {
              optionSelectedBg: THEME_COLOR.optionSelectedBg,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </ApolloProvider>
  </QueryClientProvider>,
);
