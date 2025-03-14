import { Channel } from '$renderer/libs/deviceProtocol/core/enum/channel';
import { ByteUtils } from '$renderer/libs/deviceProtocol/util/byteUtils';

export const ECGDataNotiHandler = {
  parseSampleECG(ecgConfig, data) {
    const channels = this.convertChannel(ecgConfig.channel);
    switch (channels.length) {
      case 1:
        return this.parseOneChannel(channels, data);
      case 2:
        return this.parseTwoChannel(channels, data);
      case 3:
        return this.parseThreeChannel(data);
      case 4:
        return this.parseFourChannel(data);
      default:
        return null;
    }
  },

  convertChannel(value) {
    const list = [];
    switch (value) {
      case '1':
        list.push(Channel.CH_1);
        break;
      case '2':
        list.push(Channel.CH_2);
        break;
      case '3':
        list.push(Channel.CH_3);
        break;
      case '12':
        list.push(Channel.CH_1, Channel.CH_2);
        break;
      case '13':
        list.push(Channel.CH_1, Channel.CH_3);
        break;
      case '23':
        list.push(Channel.CH_2, Channel.CH_3);
        break;
      case '123':
        list.push(Channel.CH_1, Channel.CH_2, Channel.CH_3);
        break;
      case '1234':
        list.push(Channel.CH_1, Channel.CH_2, Channel.CH_3, Channel.CH_4);
        break;
    }
    return list;
  },

  parseOneChannel(channels, data) {
    const ch = [];
    for (let i = 0; i <= data.length - 2; i += 2) {
      const sample = ByteUtils.subByteArray(data, i, 2);
      if (!sample) continue;
      const value = ByteUtils.toShort(sample, 'LE');
      ch.push(value);
    }
    switch (channels[0]) {
      case Channel.CH_1:
        return { ch1: ch };
      case Channel.CH_2:
        return { ch2: ch };
      case Channel.CH_3:
        return { ch3: ch };
      case Channel.CH_4:
        return { ch4: ch };
    }
  },

  parseTwoChannel(channels, data) {
    const data1 = [];
    const data2 = [];
    for (let i = 0; i <= data.length - 4; i += 4) {
      const sample1 = ByteUtils.subByteArray(data, i, 2);
      const sample2 = ByteUtils.subByteArray(data, i + 2, 2);
      if (!sample1 || !sample2) continue;
      const value1 = ByteUtils.toShort(sample1, 'LE');
      const value2 = ByteUtils.toShort(sample2, 'LE');
      data1.push(value1);
      data2.push(value2);
    }
    const chValue1 = channels[0];
    const chValue2 = channels[1];
    if (chValue1 === Channel.CH_1 && chValue2 === Channel.CH_2) {
      return { ch1: data1, ch2: data2 };
    } else if (chValue1 === Channel.CH_1 && chValue2 === Channel.CH_3) {
      return { ch1: data1, ch3: data2 };
    } else {
      return { ch2: data1, ch3: data2 };
    }
  },

  parseThreeChannel(data) {
    const data1 = [];
    const data2 = [];
    const data3 = [];
    for (let i = 0; i <= data.length - 6; i += 6) {
      const sample1 = ByteUtils.subByteArray(data, i, 2);
      const sample2 = ByteUtils.subByteArray(data, i + 2, 2);
      const sample3 = ByteUtils.subByteArray(data, i + 4, 2);
      if (!sample1 || !sample2 || !sample3) continue;
      data1.push(...sample1.slice().reverse());
      data2.push(...sample1.slice().reverse());
      data3.push(...sample1.slice().reverse());
    }
    return { ch1: data1, ch2: data2, ch3: data3 };
  },

  parseFourChannel(data) {
    const data1 = [];
    const data2 = [];
    const data3 = [];
    const data4 = [];
    for (let i = 0; i <= data.length - 8; i += 8) {
      const sample1 = ByteUtils.subByteArray(data, i, 2);
      const sample2 = ByteUtils.subByteArray(data, i + 2, 2);
      const sample3 = ByteUtils.subByteArray(data, i + 4, 2);
      const sample4 = ByteUtils.subByteArray(data, i + 6, 2);
      if (!sample1 || !sample2 || !sample3 || !sample4) continue;
      const value1 = ByteUtils.toShort(sample1, 'LE');
      const value2 = ByteUtils.toShort(sample2, 'LE');
      const value3 = ByteUtils.toShort(sample3, 'LE');
      const value4 = ByteUtils.toShort(sample4, 'LE');
      data1.push(value1);
      data2.push(value2);
      data3.push(value3);
      data4.push(value4);
    }
    return { ch1: data1, ch2: data2, ch3: data3, ch4: data4 };
  },
};
