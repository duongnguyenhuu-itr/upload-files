import { consoleTimeLog } from '../../../../../utils';

export const SmStudyHandler = {
  handle(usbComDevice, packageStringData) {
    consoleTimeLog('SmStudyHandler :', packageStringData);
    if (packageStringData.includes('OK+STUDYSTAT')) {
      const data = packageStringData.replace(`OK+STUDYSTAT=`, '');
      const message = data.split(',') || [];
      usbComDevice.getStudyStartStatus({
        studyId: message[0],
        studyStatus: message[1],
        exportStatus: Number(message[2]),
      });
    }
  },
};
