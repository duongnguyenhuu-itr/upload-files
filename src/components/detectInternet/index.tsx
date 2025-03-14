import { Flex } from 'antd';
import './detectInternet.s.scss';
import { useInternetConnectivity } from '@/utils/customHook';

const DetectInternet = () => {
  const isOnline = useInternetConnectivity();

  if (isOnline) {
    return null;
  }

  return (
    <Flex className='detect-internet' align='center' justify='center'>
      <p>Không thể kết nối mạng!</p>
    </Flex>
  );
};

export default DetectInternet;
