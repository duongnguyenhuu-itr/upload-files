/* eslint-disable react-hooks/exhaustive-deps */
import { Flex } from 'antd';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './home.s.scss';
import { useForceRender, useInternetConnectivity } from '@/utils/customHook';
import DeviceManager from '@/pages/home/layout/deviceManager';

const Home = () => {
  return (
    <Flex className='home' vertical>
      <DeviceManager />
    </Flex>
  );
};

export default Home;
