import { CRC32MPEG2 } from './CRC32MPEG2';
import { ByteUtils } from './byteUtils';

export const FrameBuilder = {
  /**
   * Frame = FrameHeader + FrameData + FrameFooter
   * @param sequenceNumber
   * @param packets all packet need to send to device
   * @return
   */
  usbBuildFrame: function (sequenceNumber, packets) {
    const frameData = this.buildFrameData(packets);
    const frameHeader = this.buildFrameHeader(sequenceNumber, frameData.length);
    const frameFooter = this.buildFrameFooter(frameHeader, frameData);
    const frameHeaderAndData = ByteUtils.concatenateTwoByteArray(frameHeader, frameData);
    return ByteUtils.concatenateTwoByteArray(frameHeaderAndData, frameFooter);
  },

  /**
   * Similar to usbBuildFrame
   * A frame which contains one or multiple USB synchronization packets (channel ID = 255) always has fixed sequence number 65535 (0xFFFF)
   * @param packets all packet need to send to device
   * @return
   */
  usbBuildSynFrame: function (packets) {
    const frameData = this.buildFrameData(packets);
    const frameHeader = this.buildFrameHeader(65535, frameData.length); // Fixed sequence number for sync frame
    const frameFooter = this.buildFrameFooter(frameHeader, frameData);
    const frameHeaderAndData = ByteUtils.concatenateTwoByteArray(frameHeader, frameData);
    return ByteUtils.concatenateTwoByteArray(frameHeaderAndData, frameFooter);
  },

  /**
   * Create 4 byte frame header contain 2 byte sequence number and 2 byte data length
   * FrameHeader = SequenceNumber + DataLength (2 + 2 = 4 byte)
   * @param sequenceNumber
   * @param dataLength
   * @return
   * */
  buildFrameHeader: function (sequenceNumber, dataLength) {
    const sequenceNumHeader = this.buildSequenceNumber(sequenceNumber);
    const dataLengthHeader = this.buildDataLength(dataLength);
    return ByteUtils.concatenateTwoByteArray(sequenceNumHeader, dataLengthHeader);
  },

  /**
   * Create 2 byte (little endian) sequence number of frame header
   */
  buildSequenceNumber: function (sequence) {
    return ByteUtils.integerToByteArraySimple(sequence); // Assuming little endian
  },

  /**
   * Create 2 byte (little endian) data length of frame header
   */
  buildDataLength: function (dataLength) {
    return ByteUtils.integerToByteArraySimple(dataLength); // Assuming little endian
  },

  /**
   * Create frame data contain all packet in sequential order
   * FrameData = packet0 + packet1 + .... + packetN
   * @param packets
   * @return
   */
  buildFrameData: function (packets) {
    return packets.reduce(
      (acc, packet) => ByteUtils.concatenateTwoByteArray(acc, packet),
      new Uint8Array(),
    );
  },

  /**
   * Create 4 byte frame footer
   * FrameFooter is 4 byte (little endian) CRC32 calculated from frame header and frame data
   * @param frameHeader
   * @param frameData
   * @return
   */
  buildFrameFooter: function (frameHeader, frameData) {
    const frameHeaderAndData = ByteUtils.concatenateTwoByteArray(frameHeader, frameData);
    const dataToCalCRC = CRC32MPEG2.paddingDataToAlignedToWord(frameHeaderAndData);
    const reversedByteArray = CRC32MPEG2.reverseByteArray(dataToCalCRC);
    return CRC32MPEG2.calc(reversedByteArray);
  },
};
