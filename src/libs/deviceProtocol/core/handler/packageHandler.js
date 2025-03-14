/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */

import { consoleTimeLog } from '../../../../utils';
import { ByteUtils } from '../../util/byteUtils';
import { PackageUtils } from '../../util/packageUtils';
import { ChannelID, getChannelID } from '../enum/channelID';
import { SmIDHandler } from './sm/smIDHandler';
import { SmMassHandler } from './sm/smMassHandler';
import { SmNotificationHandler } from './sm/smNotificationHandler';
import { SmNWADAPTERHandler } from './sm/smNWADAPTERHandler';
import { SmREBOOTHandler } from './sm/smREBOOTHandler';
import { SmStudyHandler } from './sm/smStudyHandler';
import { SmUECGHandler } from './sm/smUECGHandler2';
import { HandShakeHandler } from './usbSyn/handShakeHandler';

export const PackageHandler = {
  TAG: 'PackageHandler',
  handle(usbComDevice, pack) {
    const packages = this.parseFrameDataIntoPackages(pack);
    if (!packages) return;
    packages.forEach((p) => {
      this.handlePackage(usbComDevice, p);
    });
  },

  handlePackage(usbComDevice, pack) {
    const channelId = getChannelID(pack[0]);
    // consoleTimeLog(`===>>> ${usbComDevice.deviceId} ==channelId ${channelId}`);
    const dataLength = PackageUtils.getPackageDataLength(pack);
    if (dataLength === null) return;
    const packageData = ByteUtils.subByteArray(pack, 2, dataLength);
    if (!packageData) return;
    consoleTimeLog(`===>>> ${usbComDevice.deviceId} ${this.TAG}`, {
      pack: ByteUtils.toHexString(pack),
      channelId,
    });
    switch (channelId) {
      case ChannelID.USB_SYN:
        const packageStringDataUSB_SYN = new TextDecoder('utf-8').decode(
          ByteUtils.subByteArray(packageData, 0, packageData.length - 1),
        );
        consoleTimeLog(`${usbComDevice.deviceId} ==USB_SYN`, packageStringDataUSB_SYN);
        HandShakeHandler.handle(usbComDevice, packageStringDataUSB_SYN);
        break;
      case ChannelID.SM_COMMAND:
        const packageStringDataSM_COMMAND = new TextDecoder('utf-8').decode(
          ByteUtils.subByteArray(packageData, 0, packageData.length - 1),
        );
        consoleTimeLog(
          `${usbComDevice.deviceId} ==SM_COMMAND`,
          packageStringDataSM_COMMAND,
        );
        if (packageStringDataSM_COMMAND.includes('NWADAPTER')) {
          SmNWADAPTERHandler.handle(usbComDevice, packageStringDataSM_COMMAND);
        } else if (packageStringDataSM_COMMAND.includes('ID')) {
          SmIDHandler.handle(usbComDevice, packageStringDataSM_COMMAND);
        } else if (packageStringDataSM_COMMAND.includes('MODEMREBOOT')) {
          SmREBOOTHandler.handle(usbComDevice, packageStringDataSM_COMMAND);
        } else if (packageStringDataSM_COMMAND.includes('UECG')) {
          SmUECGHandler.handle(usbComDevice, packageStringDataSM_COMMAND);
        } else if (packageStringDataSM_COMMAND.includes('STUDY')) {
          SmStudyHandler.handle(usbComDevice, packageStringDataSM_COMMAND);
        } else if (packageStringDataSM_COMMAND.includes('MASS')) {
          SmMassHandler.handle(usbComDevice, packageStringDataSM_COMMAND);
        }
        break;
      case ChannelID.STUDY_PROTOCOL:
        usbComDevice.sendDataToTCPSocketServer(packageData);
        break;
      case ChannelID.ECG_SAMPLE:
        usbComDevice.onECGData(packageData);
        break;
      case ChannelID.SM_NOTIFICATION:
        const packageStringDataSM_NOTIFICATION = new TextDecoder('utf-8').decode(
          packageData,
        );
        consoleTimeLog(
          `${usbComDevice.deviceId} ==SM_NOTIFICATION`,
          packageStringDataSM_NOTIFICATION,
          packageData,
        );
        SmNotificationHandler.handle(usbComDevice, packageStringDataSM_NOTIFICATION);
        break;
      case ChannelID.KEEP_ALIVE:
        // usbComDevice.sendKaRightWay();
        break;
      default:
        break;
    }
  },

  parseFrameDataIntoPackages(pack) {
    if (pack.length === 0) {
      return null;
    }
    const currentPackage = this.getPackage(pack);
    if (!currentPackage) return null;
    const remainBytes = ByteUtils.subByteArray(
      pack,
      currentPackage.length,
      pack.length - currentPackage.length,
    );
    if (!remainBytes) return [currentPackage];
    const remainPackage = this.parseFrameDataIntoPackages(remainBytes);
    if (!remainPackage) return [currentPackage];

    return [currentPackage, ...remainPackage];
  },

  getPackage(pack) {
    const dataLength = PackageUtils.getPackageDataLength(pack);
    if (dataLength === null) return null;
    const packageData = ByteUtils.subByteArray(pack, 2, dataLength);
    if (!packageData) return null;
    return ByteUtils.concatenateTwoByteArray([pack[0], pack[1]], packageData);
  },
};
