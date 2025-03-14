import { PortInfo } from './deviceManager.d';

export const PORT_INFO_OCTO_DEVICES: PortInfo[] = [{ usbVendorId: 0x0483 }];
// usbProductId: 0x5740

export enum DeviceStatus {
  INIT = 'INIT',
  CONNECTED = 'CONNECTED',
  CONNECTING = 'CONNECTING',
  DISCONNECTING = 'DISCONNECTING',
  DISCONNECTED = 'DISCONNECTED',
}
