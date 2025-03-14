const ChannelID = {
  SM_COMMAND: 0x00,
  SM_NOTIFICATION: 0x01,
  KEEP_ALIVE: 0x02,
  ECG_SAMPLE: 0x03,
  ACC_SAMPLE: 0x04,
  TMP_SAMPLE: 0x05,
  DEBUG: 0x06,
  INTERNET_BRIDGE: 0x07,
  STUDY_PROTOCOL: 0x08,
  USB_SYN: 0xff,
};

function getChannelID(value) {
  // Convert the ChannelID object into an array of [key, value] pairs, then find the pair that matches the given value
  const channelEntry = Object.entries(ChannelID).find(([, val]) => val === value);
  // If a matching entry is found, return the key (channel name), otherwise return null
  return channelEntry ? channelEntry[1] : null;
}

export { ChannelID, getChannelID };
