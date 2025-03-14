import { EMITTER_CONSTANTS } from '@/constants';
import { handleSignOut } from '@/layouts/mainLayout/mainLayout.h';
import { Auth } from 'aws-amplify';
import { Socket, io } from 'socket.io-client';
import emitter from './emitter';

class SocketClient {
  private isconnected: boolean;
  private socket: Socket | null;

  constructor() {
    this.isconnected = false;
    this.socket = null;
  }

  getAuth = async () => {
    const accessToken = (await Auth.currentSession()).getAccessToken().getJwtToken();
    return {
      accessToken,
    };
  };

  connectToServer = async (): Promise<void> => {
    if (!this.socket) {
      try {
        this.socket = io(import.meta.env.VITE_SOCKET_URL, {
          forceNew: true,
          transports: ['websocket'],
          auth: async (cb) => cb(await this.getAuth()),
        });
        this.socket.on('connect', this.connectListener);
      } catch (error) {
        console.log(
          '🚀 ~ file: socketIo.ts:31 ~ SocketClient ~ connectToServer= ~ error:',
          error,
        );
        this.disconnectSocket();
      }
    }
  };

  emitIntervalEvent = (status: string, id: string) => {
    if (this.isconnected) {
      this.socket.emit(status, id);
    } else {
      const interval = setInterval(() => {
        console.log('join room:', this.isconnected, id);
        if (this.isconnected) {
          this.socket.emit(status, id);
          clearInterval(interval);
        }
      }, 1000);
    }
  };

  joinRoom = (id: string) => {
    if (id && id !== 'undefined') {
      this.emitIntervalEvent('room', id);
    }
  };

  private connectListener = async () => {
    this.isconnected = true;
    this.socket.io.off('reconnect');
    this.socket.on('disconnect', this.disconnectListener);
    this.socket.on('syncDeviceData', this.syncDeviceDataListener);
  };

  private disconnectListener = (error: string): void => {
    console.log('on disconnect:', error);
    this.isconnected = false;
    if (this.socket) {
      this.socket.io.on('reconnect', this.reconnectListener);
      this.socket.off('connect');
      this.socket.off('disconnect');

      if (error && error.trim() === 'io server disconnect') {
        this.disconnectSocket(false);
      }
    }
  };

  private reconnectListener = (): void => {
    console.log('on reconnect');
    if (this.socket) {
      this.socket.on('connect', this.connectListener);
    }
    window.location.reload();
  };

  private syncDeviceDataListener = (data: any): void => {
    emitter.emit(EMITTER_CONSTANTS.SYNC_DEVICE_DATA, data);
  };

  disconnectSocket = (shouldLogout = true): void => {
    console.log('socket io disconnect', this.socket);
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = null;
    if (shouldLogout) {
      handleSignOut();
    }
  };
}

const staticSocket = new SocketClient();

export default staticSocket;
