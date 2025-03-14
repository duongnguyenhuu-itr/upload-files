export const SmREBOOTHandler = {
  handle(usbComDevice, packageStringData) {
    if (packageStringData.includes('OK+MODEMREBOOT')) {
      usbComDevice.onModemRebootComplete(true);
    } else {
      usbComDevice.onModemRebootComplete(false);
    }
  },
};
