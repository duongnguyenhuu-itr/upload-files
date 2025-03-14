export const Constant = {
  MAX_SEQUENCE_NUMBER: 65534,
  WRITE_WAIT_MILLIS: 300,
  READ_WAIT_MILLIS: 1000,
  ACTION_USB_PERMISSION: 'com.android.example.USB_PERMISSION',
  INTENT_FILTER_USB_DEVICE_ATTACHED: 'android.hardware.usb.action.USB_DEVICE_ATTACHED',
  TIME_SEND_KA_INTERVAL_SEC: 5,
  TIME_SEND_KA_INTERVAL_MILLISECOND: 5000,
  TIME_RECV_KA_INTERVAL_SEC: 8,
  MAX_PACKET_SIZE: 255,
  BT_MAX_PACKET_SIZE: 64,
  MAX_FRAME_SIZE: 5000,
};

export const DeviceStatus = {
  READY: 'Ready for new study',
  SETTING: 'Setting up',
  STUDY_PROGRESS: 'Study is in progress',
  STUDY_PAUSED: 'Study Paused',
  STUDY_COMPLETED: 'Study Completed',
  STUDY_UPLOADED: 'Study Uploaded',
  STUDY_UPLOADING: 'Uploading study data',
  STUDY_CREATED: 'Study created',
  STUDY_ABORTED: 'Aborted',
};
