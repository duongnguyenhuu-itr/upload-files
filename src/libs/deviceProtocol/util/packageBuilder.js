import { ByteUtils } from './byteUtils';

export const PackageBuilder = {
  /**
   * Package = ChannelId(1 byte) + Data length(1 byte) + data
   */
  usbBuildPackage: function (channelID, data) {
    const dataLength = data.length;
    const header = new Uint8Array([channelID, dataLength]);

    return ByteUtils.concatenateTwoByteArray(header, data);
  },
};
