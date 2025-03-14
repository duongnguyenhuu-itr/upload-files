import { ByteUtils } from '../../../util/byteUtils';
import { ChannelID } from '../../enum/channelID';

export const SmSPREBOOT = {
  request() {
    const channelID = ChannelID.SM_COMMAND;
    const data = 'SM+SPREBOOT';
    const bytesData = ByteUtils.buildUsbPackageData(data);
    const dataLength = bytesData.length;

    const packageHeader = new Uint8Array([channelID, dataLength]);

    return ByteUtils.concatenateTwoByteArray(packageHeader, bytesData);
  },
};
