import useBoundStore from '@/store';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './loadingPage.s.scss';
import { t } from 'i18next';

const LoadingPage = () => {
  const isLoading = useBoundStore((state) => state.authentication.isLoading);

  return (
    isLoading && (
      <div className='loading-page'>
        <div className='loading-page__container'>
          <Spin indicator={<LoadingOutlined spin />} />
          <div className='loading-page__text'>{t('loading')}</div>
        </div>
      </div>
    )
  );
};

export default LoadingPage;
