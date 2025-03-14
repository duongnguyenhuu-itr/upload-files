import { consoleTimeLog } from '../../../../../utils';

export const HandShakeHandler = {
  handle(usbComDevice, packageStringData) {
    consoleTimeLog('HandShakeHandler', usbComDevice);
    if (packageStringData.includes('SYN=')) {
      const message = packageStringData.split(/[=,]/);
      const schemaVersion = parseInt(message[1], 10);
      const deviceSequenceNumber = parseInt(message[2], 10);

      usbComDevice.schemaVersion = schemaVersion;
      usbComDevice.deviceSequenceNumber = deviceSequenceNumber;
    } else if (packageStringData.includes('KEY=')) {
      const message = packageStringData.split(/[=,]/);
      const randomKey = message[1];

      usbComDevice.randomKey = randomKey;
    }
    if (this.isHandShakeComplete(usbComDevice)) {
      usbComDevice.onSynComplete();
    }
  },
  isHandShakeComplete(usbComDevice) {
    return (
      usbComDevice.schemaVersion !== 0 &&
      usbComDevice.deviceSequenceNumber !== 0 &&
      usbComDevice.randomKey !== ''
    );
  },
};
