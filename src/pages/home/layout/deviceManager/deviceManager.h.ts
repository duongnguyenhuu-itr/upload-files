import appLocalStorage from '@/utils/localStorage';

export const getKeyDevice = (portInfo: any) => {
  const { usbVendorId, usbProductId } = portInfo.getInfo() || {};
  if (!usbProductId) return null;
  return appLocalStorage.getDeviceId(`${usbVendorId}_${usbProductId}`) || null;
};
