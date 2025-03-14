/* eslint-disable default-case */
import { ByteUtils } from '../../../util/byteUtils';
import { ChannelID } from '../../enum/channelID';
import { NetworkAdapterType } from '../../enum/networkAdapterType';

export const SmNWADAPTER = {
  request(type, key) {
    const channelID = ChannelID.SM_COMMAND;
    let data;
    switch (type) {
      case NetworkAdapterType.BT:
        if (key) {
          data = `SM+NWADAPTERTOKEN=BT,"${key}"`;
        } else {
          data = 'SM+NWADAPTER=BT';
        }
        break;
      case NetworkAdapterType.USB:
        data = 'SM+NWADAPTER=USB';
        break;
    }
    const bytesData = ByteUtils.buildUsbPackageData(data);
    const dataLength = bytesData.length;

    const packageHeader = new Uint8Array([channelID, dataLength]);

    return ByteUtils.concatenateTwoByteArray(packageHeader, bytesData);
  },
};
