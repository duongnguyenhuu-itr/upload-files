import { consoleTimeLog } from '../../../../../utils';
import { ByteUtils } from '../../../util/byteUtils';
import { ChannelID } from '../../enum/channelID';

export const SmMass = {
  request() {
    consoleTimeLog('Send SmMass');
    const channelID = ChannelID.SM_COMMAND;
    const data = 'SM+MASS2?';
    const bytesData = ByteUtils.buildUsbPackageData(data);
    const dataLength = bytesData.length;

    const packageHeader = new Uint8Array([channelID, dataLength]);

    return ByteUtils.concatenateTwoByteArray(packageHeader, bytesData);
  },
};
