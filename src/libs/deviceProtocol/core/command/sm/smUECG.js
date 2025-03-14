import { ByteUtils } from '../../../util/byteUtils';
import { ChannelID } from '../../enum/channelID';

export const SmUECG = {
  request(enable) {
    const channelID = ChannelID.SM_COMMAND;
    const data = enable ? 'SM+UECG=1' : 'SM+UECG=0';
    const bytesData = ByteUtils.buildUsbPackageData(data);
    const dataLength = bytesData.length;

    const packageHeader = new Uint8Array([channelID, dataLength]);

    return ByteUtils.concatenateTwoByteArray(packageHeader, bytesData);
  },
};
