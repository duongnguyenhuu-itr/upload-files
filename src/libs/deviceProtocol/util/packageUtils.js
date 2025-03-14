/* eslint-disable no-bitwise */
import { ByteUtils } from './byteUtils';

export const PackageUtils = {
  /**
   * Package length is 1st unsigned-byte of data
   */
  getPackageDataLength(packet) {
    const bytesLength = ByteUtils.subByteArray(packet, 1, 1);
    if (!bytesLength) return null;
    // Assuming bytesLength[0] contains the byte of interest and is the LSB in little-endian format
    return bytesLength[0];
  },
};
