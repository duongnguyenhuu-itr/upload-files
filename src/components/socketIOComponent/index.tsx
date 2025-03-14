import staticSocket from '@/utils/socketIo';
import { useEffect } from 'react';

const SocketIOComponent = () => {
  useEffect(() => {
    staticSocket.connectToServer();
    return () => {
      staticSocket.disconnectSocket(false);
    };
  }, []);
  return null;
};

export default SocketIOComponent;
