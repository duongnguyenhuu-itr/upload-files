import { Constant } from '../constant';

export const FrameUtils = {
  calculateSequenceNumber: function (oldSequenceNumber, dataLength) {
    return (dataLength + oldSequenceNumber) % (Constant.MAX_SEQUENCE_NUMBER + 1);
  },
};
