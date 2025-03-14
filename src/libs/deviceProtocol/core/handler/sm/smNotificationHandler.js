import { consoleTimeLog } from '../../../../../utils';

export const SmNotificationHandler = {
  handle(usbComDevice, packageStringData) {
    consoleTimeLog('SmNotificationHandler.handle:', packageStringData);
    if (packageStringData.includes('NT+DEV_STAT')) {
      const deviceInfo = this.parseInputString(
        packageStringData.replace('NT+DEV_STAT=', ''),
      );
      usbComDevice.onUpdateDeviceInfo(deviceInfo);
    } else if (packageStringData.includes('NT+EXPORTSTAT')) {
      const data = packageStringData.replace(`NT+EXPORTSTAT`, '');
      const message = data.split(',') || [];
      if (message[message.length - 1] === '1') {
        usbComDevice.onExportCompleted();
      }
    }
  },

  parseInputString(str) {
    const result = {};
    const pairs = str.split(';');

    pairs.forEach((pair) => {
      let [key, value] = pair.split('=').map((part) => part.trim());
      // Convert numeric values
      if (!isNaN(value)) {
        value = Number(value);
      }
      // Convert boolean values
      else if (value === 'true' || value === 'false') {
        value = value === 'true';
      }
      result[key] = value;
    });

    return result;
  },
};
