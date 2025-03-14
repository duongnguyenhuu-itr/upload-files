import { ByteUtils } from '../../../util/byteUtils';
import { ChannelID } from '../../enum/channelID';

export const SynCmd = {
  request(key) {
    const channelID = ChannelID.USB_SYN;
    const data = key ? `SYN=0,TOKEN=${key}` : 'SYN=0';
    const bytesData = ByteUtils.buildUsbPackageData(data);
    const dataLength = bytesData.length;

    const packageHeader = new Uint8Array([channelID, dataLength]);

    return ByteUtils.concatenateTwoByteArray(packageHeader, bytesData);
  },
};
