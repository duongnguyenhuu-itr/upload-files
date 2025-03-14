export const SmNWADAPTERHandler = {
  handle(usbComDevice, packageStringData) {
    if (packageStringData.includes('OK+NWADAPTER=USB')) {
      usbComDevice.networkAdapterType = 'USB';
      usbComDevice.onChangeNetworkAdapterComplete(true);
    } else if (
      packageStringData.includes('OK+NWADAPTER=BT') ||
      packageStringData.includes('OK+NWADAPTERTOKEN=BT')
    ) {
      usbComDevice.networkAdapterType = 'BT';
      usbComDevice.onChangeNetworkAdapterComplete(true);
    } else {
      usbComDevice.networkAdapterType = null;
      usbComDevice.onChangeNetworkAdapterComplete(false);
    }
  },
};
