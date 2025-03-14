import classNames from 'classnames';
import React from 'react';
import './mainLayout.s.scss';
import DetectInternet from '@/components/detectInternet';
import MainHeader from '@/layouts/mainHeader';
import MainFooter from '@/layouts/mainFooter';

interface MainLayoutProps {
  children: React.ReactNode | string | number;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={classNames('main-layout')}>
      <DetectInternet />
      <MainHeader />
      <div className='main-layout-body'>{children}</div>
      <MainFooter />
    </div>
  );
};

export default MainLayout;
