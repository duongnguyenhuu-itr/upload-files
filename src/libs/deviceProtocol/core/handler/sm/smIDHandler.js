export const SmIDHandler = {
  handle(usbComDevice, packageStringData) {
    if (packageStringData.includes('OK+ID')) {
      const message = packageStringData.split(/[=,]/);
      usbComDevice.deviceId = message[1];
      usbComDevice.onGetIdComplete(true);
    } else {
      usbComDevice.onGetIdComplete(false);
    }
  },
};
