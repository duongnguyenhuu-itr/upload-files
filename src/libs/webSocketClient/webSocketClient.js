import { Auth } from 'aws-amplify';
import ReconnectingWebSocket from 'reconnecting-websocket';
import LINK_CONFIG from '../../aws/env';
import { consoleTimeLog } from '../../utils';
import { ByteUtils } from '../deviceProtocol/util/byteUtils';

const WebSocketActionEnum = {
  JOIN_ROOM: 'joinRoom',
  SEND_MESSAGE: 'sendMessage',
  MESSAGE: 'message',
  ROOM_CHANGED: 'roomChanged',
};

export class WebSocketClient {
  constructor() {
    this.TAG = 'WebSocketClient';
    this.socket = null;
    this.connected = false;
    this.payloadSize = 10;
    this.deviceId = null;
    this.token = null;
    this.connectionIds = [];
    this.streamingEcgDataBuffer = { ch1: [], ch2: [], ch3: [] };
    this.kaTimeout = null;
    this.leaveRoomTimeout = null;

    this.onConnectedFunc = null;
    this.onDisconnectedFunc = null;
    this.onErrorFunc = null;
    this.connect = this.connect.bind(this);
    this.sendEcgData = this.sendEcgData.bind(this);
    this.getDataInBufferToSend = this.getDataInBufferToSend.bind(this);
    this.joinStreamingRoom = this.joinStreamingRoom.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.autoDisconnect = this.autoDisconnect.bind(this);
    this.onWebsocketConnected = this.onWebsocketConnected.bind(this);
    this.onWebsocketMessage = this.onWebsocketMessage.bind(this);
    this.onWebsocketClose = this.onWebsocketClose.bind(this);
    this.onWebsocketError = this.onWebsocketError.bind(this);
    this.restartKaTimeout = this.restartKaTimeout.bind(this);
    this.restartLeaveRoomTimeout = this.restartLeaveRoomTimeout.bind(this);
    this.clearAllTimeout = this.clearAllTimeout.bind(this);
  }

  isActivelyStreaming = () => {
    return this.connectionIds.length > 0;
  };

  isConnected = () => {
    return this.connected;
  };

  connect = async (deviceId) => {
    this.deviceId = deviceId;
    try {
      const currentSession = await Auth.currentSession();
      const token = currentSession.getAccessToken().getJwtToken();
      this.socket = new ReconnectingWebSocket(
        `${LINK_CONFIG.SOCKET_STREAMING_URL}?Auth=${token}`,
      );
      this.socket.binaryType = 'arraybuffer';
      this.socket.addEventListener('open', this.onWebsocketConnected);
      this.socket.addEventListener('message', this.onWebsocketMessage);
      this.socket.addEventListener('close', this.onWebsocketClose);
      this.socket.addEventListener('error', this.onWebsocketError);
      this.restartKaTimeout();
    } catch (error) {
      consoleTimeLog(
        `===>>> ${this.deviceId} Streaming ECG web socket request connect error`,
        error,
      );
    }
  };

  sendEcgData(sampleRate, gain, ch1, ch2, ch3) {
    this.streamingEcgDataBuffer.ch1.push(...ch1);
    this.streamingEcgDataBuffer.ch2.push(...ch2);
    this.streamingEcgDataBuffer.ch3.push(...ch3);
    if (this.streamingEcgDataBuffer.ch1.length >= this.payloadSize * sampleRate * 2) {
      const ecgJson = this.getDataInBufferToSend(sampleRate, gain);
      consoleTimeLog(`===>>> ${this.deviceId} Streaming ECG enough 10s data`, {
        ecgJson,
      });
      if (!ecgJson) {
        return;
      }

      const connectionIds = this.connectionIds.map((id) => id);
      const data = {
        action: WebSocketActionEnum.SEND_MESSAGE,
        token: this.token,
        connectionIds: connectionIds,
        payload: ecgJson,
      };

      this.socket?.send(JSON.stringify(data));
    }
  }

  convertBase64ToArrayForEcg = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    // var bytes = new Uint8Array(len);
    const bytes = [];

    for (let i = 0; i < len; i += 2) {
      const byteA = binaryString.charCodeAt(i);
      const byteB = binaryString.charCodeAt(i + 1);
      const sign = byteA & (1 << 7);
      const x = ((byteA & 0xff) << 8) | (byteB & 0xff);
      if (sign) {
        const result = 0xffff0000 | x; // fill in most significant bits with 1's
        bytes.push(result);
      } else {
        bytes.push(x);
      }
    }

    return bytes;
  };

  getDataInBufferToSend(sampleRate, gain) {
    const size = this.payloadSize * sampleRate * 2;
    const ch1 = this.streamingEcgDataBuffer.ch1.splice(0, size);
    const ch2 = this.streamingEcgDataBuffer.ch2.splice(0, size);
    const ch3 = this.streamingEcgDataBuffer.ch3.splice(0, size);
    const base1 = ByteUtils.convertArrayToBase64(ch1);
    const base2 = ByteUtils.convertArrayToBase64(ch2);
    const base3 = ByteUtils.convertArrayToBase64(ch3);
    const jsonObject = {
      gain: gain,
      sampleRate: sampleRate,
      ch1: base1,
      ch2: base2,
      ch3: base3,
      type: 'streaming',
    };

    return jsonObject;
  }

  joinStreamingRoom = (roomId) => {
    consoleTimeLog(`===>>> ${this.deviceId} Streaming ECG web socket join room`, roomId);
    this.socket.send(JSON.stringify({ action: WebSocketActionEnum.JOIN_ROOM, roomId }));
  };

  sendMessage = ({ token, connectionIds, payload }) => {
    this.socket.send(
      JSON.stringify({
        action: WebSocketActionEnum.SEND_MESSAGE,
        token,
        connectionIds,
        payload,
      }),
    );
  };

  disconnect = () => {
    this.clearAllTimeout();
    this.socket.close(1000, 'close');
    this.socket = null;
    this.streamingEcgDataBuffer = { ch1: [], ch2: [], ch3: [] };
  };

  autoDisconnect = () => {
    this.disconnect();
    if (this.onDisconnectedFunc) {
      this.onDisconnectedFunc();
    }
  };

  onWebsocketConnected = (event) => {
    consoleTimeLog(`===>>> ${this.deviceId} Streaming ECG web socket connected`);
    this.joinStreamingRoom(this.deviceId);
    this.connected = true;
    if (this.onConnectedFunc) {
      this.onConnectedFunc();
    }
  };

  onWebsocketMessage = (data) => {
    const parsedData = JSON.parse(data.data);
    switch (parsedData.action) {
      case WebSocketActionEnum.ROOM_CHANGED:
        consoleTimeLog(`===>>> ${this.deviceId} Streaming ECG room changed`, parsedData);
        this.connectionIds = parsedData?.connectionIds;
        this.token = parsedData?.token;
        if (parsedData?.connectionIds.length < 2) {
          this.restartLeaveRoomTimeout();
        }
        break;
      case WebSocketActionEnum.MESSAGE:
        if (parsedData?.payload?.type === 'ping') {
          consoleTimeLog(`===>>> ${this.deviceId} Streaming ECG ping`);
          this.restartKaTimeout();
        }
        break;
      default:
        break;
    }
  };

  onWebsocketClose = (event) => {
    console.log('onWebsocketClose ', event);
    consoleTimeLog(`===>>> ${this.deviceId} onWebsocketClose`, event);
    this.connected = false;
  };

  onWebsocketError = (event) => {
    consoleTimeLog(`===>>> ${this.deviceId} onWebsocketError`, event);
    this.connected = false;
    this.autoDisconnect();
    if (this.onErrorFunc) {
      this.onErrorFunc();
    }
  };

  restartKaTimeout = () => {
    if (this.kaTimeout) {
      clearTimeout(this.kaTimeout);
    }
    this.kaTimeout = setTimeout(() => {
      this.autoDisconnect();
    }, 40 * 1000);
  };

  restartLeaveRoomTimeout = () => {
    if (this.kaTimeout) {
      clearTimeout(this.kaTimeout);
    }
    this.kaTimeout = setTimeout(() => {
      this.autoDisconnect();
    }, 5 * 1000);
  };

  clearAllTimeout = () => {
    if (this.kaTimeout) {
      clearTimeout(this.kaTimeout);
    }
    if (this.leaveRoomTimeout) {
      clearTimeout(this.leaveRoomTimeout);
    }
  };

  onConnected(callbackFunc) {
    this.onConnectedFunc = callbackFunc;
  }

  onDisconnected(callbackFunc) {
    this.onDisconnectedFunc = callbackFunc;
  }

  onError(callbackFunc) {
    this.onErrorFunc = callbackFunc;
  }
}
