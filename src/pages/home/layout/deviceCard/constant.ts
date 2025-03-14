export enum FileHeaderInfo {
  startLookupTable = 0x00000800,
  startNumOfBlock = 0x00000400 + 1,
  endNumOfBlock = 0x00000400 + 5,
}

export enum LoadingStatus {
  INIT = 'INIT',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum DEVICE_EXAMPLE_INFO {
  deviceId = '9211220012',
  studyId = '67cfa153198ff28a1c7d6c94',
}
