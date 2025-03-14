import { consoleTimeLog } from '../../../../../utils';

export const SmMassHandler = {
  handle(usbComDevice, packageStringData) {
    consoleTimeLog('SmMassHandler :', packageStringData);
    if (packageStringData.includes('OK+MASS2')) {
      usbComDevice.showPublicPartition();
    }
  },
};
