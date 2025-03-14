import { consoleTimeLog } from '../../../../../utils';
import { ChannelID } from '../../enum/channelID';

export const SmKA = {
  request() {
    consoleTimeLog('Send SmKA');
    const channelID = ChannelID.KEEP_ALIVE;
    const dataLength = 0x00;

    return new Uint8Array([channelID, dataLength]);
  },
};
