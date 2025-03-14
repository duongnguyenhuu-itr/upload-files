import { StoreData } from '@/apollo/functions/handleStoreDeviceData';

export type DeviceFiles = {
  ecgs: File[];
  logs: File[];
  notifications: File[];
};

export type LookupTable = {
  [key: number]: Uint8Array<ArrayBufferLike>;
};

export type MissingItem = {
  start: number;
  stop: number;
  startPosition: number;
  stopPosition: number;
  index: number;
};

export type MissingPromise = {
  info: StoreData;
  buffer: Promise<Uint8Array>;
};
