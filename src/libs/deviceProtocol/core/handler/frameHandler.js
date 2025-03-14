import { consoleTimeLog } from '../../../../utils';
import { CRC32MPEG2 } from '../../util/CRC32MPEG2';
import { ByteUtils } from '../../util/byteUtils';
import { FrameUtils } from '../../util/frameUtils';

export const FrameHandler = {
  TAG: 'FrameHandler',

  handle(deviceId, deviceSequenceNumber, frame, complete) {
    if (this.isErrorPackage(deviceId, frame)) {
      consoleTimeLog(`===>>> ${this.TAG} ${deviceId} ErrorPackage`);
      complete(false, -1, null);
      return;
    }
    if (!this.sequenceNumberValid(deviceSequenceNumber, frame)) {
      consoleTimeLog(`===>>> ${this.TAG} ${deviceId} Error Sequence Number`, {
        deviceSequenceNumber,
        frame,
      });
      complete(false, -1, null);
      return;
    }
    if (!this.crcFrameValid(frame)) {
      consoleTimeLog(`===>>> ${this.TAG} ${deviceId} Error CRC`);
      complete(false, -1, null);
      return;
    }
    const packages = this.getPackage(frame);
    if (packages === null) {
      consoleTimeLog(`===>>> ${this.TAG} ${deviceId} Error packages null`);
      complete(false, -1, null);
      return;
    }
    let newDeviceSequenceNumber = -1;
    if (!this.isSyncPackage(frame)) {
      const sequenceNumber = this.getSequenceNumber(frame) || 0;
      newDeviceSequenceNumber = FrameUtils.calculateSequenceNumber(
        sequenceNumber,
        packages.length,
      );
    }
    complete(true, newDeviceSequenceNumber, packages);
  },

  isErrorPackage(deviceId, frame) {
    const data = new TextDecoder('utf-8').decode(frame);
    consoleTimeLog(`===>>> ${deviceId} frame decode:`, data);
    return (
      data.includes('ERR=Generic') ||
      data.includes('ERR=FrameDataLength') ||
      data.includes('ERR=FrameSequenceNumber')
    );
  },

  isSyncPackage(frame) {
    return frame[0] === 0xff && frame[1] === 0xff;
  },

  crcFrameValid(frame) {
    const clonedFrame = ByteUtils.cloneBuffer(frame);
    const frameDataLength = this.getFrameDataLength(frame);
    if (frameDataLength === null) return false;

    const bytesHeaderAndData = ByteUtils.subByteArray(
      clonedFrame,
      0,
      4 + frameDataLength,
    );
    if (!bytesHeaderAndData) return false;

    const bytesCRC = ByteUtils.subByteArray(clonedFrame, 4 + frameDataLength, 4);
    const dataToCalCRC = CRC32MPEG2.paddingDataToAlignedToWord(bytesHeaderAndData);
    const calculatedCrc = CRC32MPEG2.calc(CRC32MPEG2.reverseByteArray(dataToCalCRC));
    // return calculatedCrc.equals(bytesCRC); // Assuming you have an equals method for byte array comparison
    return ByteUtils.byteArrayEquals(calculatedCrc, bytesCRC);
  },

  /**
   * Sequence number is byte 1st 2nd of header
   */
  getSequenceNumber(frame) {
    const bytesSequence = ByteUtils.subByteArray(frame, 0, 2);
    if (bytesSequence) {
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint8(0, bytesSequence[0]);
      view.setUint8(1, bytesSequence[1]);
      return view.getInt32(0, true);
    }
    return null;
  },

  sequenceNumberValid(deviceSequenceNumber, frame) {
    if (this.isSyncPackage(frame)) {
      return true;
    }
    const clonedFrame = ByteUtils.cloneBuffer(frame);
    const packageSequenceNumber = this.getSequenceNumber(clonedFrame) || 0;
    return deviceSequenceNumber === packageSequenceNumber;
  },

  /**
   * Frame length is byte 3rd 4th of header
   */
  getFrameDataLength(frame) {
    // Assuming ByteUtils.subByteArray extracts a part of the Uint8Array and returns a new Uint8Array
    const bytesFrameLength = ByteUtils.subByteArray(frame, 2, 2);
    if (bytesFrameLength) {
      // Create a new ArrayBuffer with a size of 4 bytes
      const buffer = new ArrayBuffer(4);
      // Create a DataView to interact with the buffer
      const view = new DataView(buffer);
      // Set the first two bytes of the buffer with the extracted length, rest are already 0x00
      view.setUint8(0, bytesFrameLength[0]);
      view.setUint8(1, bytesFrameLength[1]);
      // Read the 32-bit integer from the buffer in little-endian format
      return view.getInt32(0, true);
    }
    return null;
  },

  getPackage(frame) {
    const clonedFrame = ByteUtils.cloneBuffer(frame);
    const frameDataLength = this.getFrameDataLength(clonedFrame);
    if (frameDataLength === null) return null;
    return ByteUtils.subByteArray(frame, 4, frameDataLength);
  },

  /**
   * Frame length = frame data length + 4 byte header + 4 byte crc
   * If buffer length > frame length meaning buffer is contain a frame
   */
  isContainFrame(buffer) {
    const frameDataLength = this.getFrameDataLength(buffer);
    if (frameDataLength === null) return false;
    return buffer.length >= frameDataLength + 8;
  },

  /**
   * If buffer contain a frame, extract it
   * else return null
   */
  extractFrameFromBuffer(buffer) {
    const frameDataLength = this.getFrameDataLength(buffer);
    if (frameDataLength === null) return null;
    return ByteUtils.subByteArray(buffer, 0, frameDataLength + 8);
  },
};
