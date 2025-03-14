import { DeviceInstance } from '@/libs/deviceProtocol/deviceInstance';

export type DeviceInfo = {
  battLevel: number;
  battStatus: number;
  leadStatus: boolean;
  studyStatus: string;
};

export type Device = {
  deviceId: string;
  studyId?: string;
  port: any;
  // bluetoothPath: string;
  // serialPath: string;
  deviceInfo?: DeviceInfo;
  status: DeviceStatus;
  // online: boolean;
  // isUSB: boolean;
  deviceProtocol?: DeviceInstance;
};

export type PortInfo = {
  usbVendorId?: number;
  usbProductId?: number;
};
